"use server";

import prisma from "@/lib/prisma";
import { generateSlug, uniqueSlug } from "@/lib/slug";
import { ProductStatus } from "@/generated/prisma/enums";
import { productSchema } from "@/schemas/product";
import { BadRequestError, HttpError } from "http-errors-enhanced";
import { cacheLife, revalidatePath } from "next/cache";

export const createProduct = async (data: unknown) => {
  try {
    const validatedData = productSchema.parse(data);
    const existingProduct = await prisma.product.findFirst({
      where: { name: validatedData.name },
    });

    if (existingProduct) {
      return {
        success: false,
        message: "Product with this name already exists!",
        error: "PRODUCT_EXISTS",
      };
    }

    const requestedSlug = generateSlug(
      validatedData.slug ?? validatedData.name,
    );
    const slugExists = await prisma.product.findFirst({
      where: { slug: requestedSlug },
    });
    const slug = slugExists ? uniqueSlug(requestedSlug) : requestedSlug;

    let category = await prisma.category.findFirst({
      where: { name: validatedData.categoryName },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: validatedData.categoryName,
          slug: uniqueSlug(generateSlug(validatedData.categoryName)),
        },
      });
    }

    const attributes =
      validatedData.attributes && validatedData.attributes.trim()
        ? JSON.parse(validatedData.attributes)
        : {};

    await prisma.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        brand: validatedData.brand?.trim() || null,
        slug,
        categoryId: category.id,
        tags: validatedData.tags
          ? validatedData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [],
        status: ProductStatus.ACTIVE,
        images: validatedData.imageUrl
          ? {
              create: {
                url: validatedData.imageUrl,
                altText: validatedData.name,
                isPrimary: true,
              },
            }
          : undefined,
        variants: {
          create: {
            sku: validatedData.sku,
            attributes,
            stock: validatedData.stock,
            minThreshold: validatedData.minThreshold,
            maxThreshold: validatedData.maxThreshold,
            costPrice: validatedData.costPrice,
            originalPrice: validatedData.originalPrice,
            discountType: validatedData.discountType || null,
            discountValue: validatedData.discountValue ?? null,
            discountAmount:
              validatedData.discountValue !== undefined
                ? Number(validatedData.discountValue.toFixed(2))
                : null,
            supplierId: validatedData.supplierId?.trim() || null,
          },
        },
      },
    });

    revalidatePath("/dashboard/products");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Product created successfully!",
    };
  } catch (error: unknown) {
    console.error("Error creating product:", error);

    return {
      success: false,
      message: "Failed to create product",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const getAllProducts = async () => {
  "use cache";
  cacheLife("weeks");

  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true,
            altText: true,
            isPrimary: true,
          },
          orderBy: {
            isPrimary: "desc",
          },
        },
        variants: {
          where: {
            isActive: true,
          },
          orderBy: {
            createdAt: "asc",
          },
          select: {
            id: true,
            sku: true,
            attributes: true,
            stock: true,
            minThreshold: true,
            maxThreshold: true,
            costPrice: true,
            originalPrice: true,
            discountAmount: true,
            discountType: true,
            discountValue: true,
            isActive: true,
            lastRestockedAt: true,
          },
        },
      },
    });

    return products.map((product) => {
      const primaryVariant = product.variants[0];
      const primaryImage = product.images.find((image) => image.isPrimary);

      return {
        ...product,
        images: product.images.map((image) => ({
          ...image,
          isPrimary: image.id === primaryImage?.id,
        })),
        variants: product.variants.map((variant) => ({
          ...variant,
          attributes: variant.attributes as Record<string, string>,
          costPrice: variant.costPrice.toNumber(),
          originalPrice: variant.originalPrice.toNumber(),
          discountAmount: variant.discountAmount?.toNumber() ?? null,
          discountValue: variant.discountValue?.toNumber() ?? null,
          lastRestockedAt: variant.lastRestockedAt?.toISOString() ?? null,
        })),
        primaryVariantId: primaryVariant?.id ?? null,
        price: primaryVariant?.originalPrice?.toNumber() ?? 0,
        stock: primaryVariant?.stock ?? 0,
        minThreshold: primaryVariant?.minThreshold ?? 10,
        maxThreshold: primaryVariant?.maxThreshold ?? 100,
        lastRestockedAt: primaryVariant?.lastRestockedAt?.toISOString() ?? null,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      };
    });
  } catch (error: unknown) {
    console.error(
      "Error fetching products:",
      (error as Error | HttpError).message,
    );

    return [];
  }
};

export const getProductById = async (id: string) => {
  "use cache";
  cacheLife("weeks");

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true,
            altText: true,
            isPrimary: true,
          },
          orderBy: {
            isPrimary: "desc",
          },
        },
        variants: {
          where: {
            isActive: true,
          },
          orderBy: {
            createdAt: "asc",
          },
          select: {
            id: true,
            sku: true,
            attributes: true,
            stock: true,
            minThreshold: true,
            maxThreshold: true,
            costPrice: true,
            originalPrice: true,
            discountAmount: true,
            discountType: true,
            discountValue: true,
            isActive: true,
            lastRestockedAt: true,
          },
        },
      },
    });

    if (!product) {
      throw new BadRequestError("Product not found!");
    }

    const primaryVariant = product.variants[0];
    const primaryImage = product.images.find((image) => image.isPrimary);

    return {
      ...product,
      images: product.images.map((image) => ({
        ...image,
        isPrimary: image.id === primaryImage?.id,
      })),
      variants: product.variants.map((variant) => ({
        ...variant,
        attributes: variant.attributes as Record<string, string>,
        costPrice: variant.costPrice.toNumber(),
        originalPrice: variant.originalPrice.toNumber(),
        discountAmount: variant.discountAmount?.toNumber() ?? null,
        discountValue: variant.discountValue?.toNumber() ?? null,
        lastRestockedAt: variant.lastRestockedAt?.toISOString() ?? null,
      })),
      primaryVariantId: primaryVariant?.id ?? null,
      price: primaryVariant?.originalPrice?.toNumber() ?? 0,
      stock: primaryVariant?.stock ?? 0,
      minThreshold: primaryVariant?.minThreshold ?? 10,
      maxThreshold: primaryVariant?.maxThreshold ?? 100,
      lastRestockedAt: primaryVariant?.lastRestockedAt?.toISOString() ?? null,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  } catch (error: unknown) {
    console.error(
      "Error fetching product: ",
      (error as Error | HttpError).message,
    );

    return null;
  }
};
