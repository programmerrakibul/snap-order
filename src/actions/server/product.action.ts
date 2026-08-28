"use server";

import prisma from "@/lib/prisma";
import { generateSlug, uniqueSlug } from "@/lib/slug";
import { DiscountType, ProductStatus, Role } from "@/generated/prisma/enums";
import {
  productSchema,
  TProductOutput,
} from "@/schemas/product";
import { HttpError } from "http-errors-enhanced";
import { cacheLife, revalidatePath } from "next/cache";
import { isAuthenticated } from "./isAuthenticated";

import { Prisma } from "@/generated/prisma/client";

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: {
      select: {
        id: true;
        name: true;
        slug: true;
      };
    };
    images: {
      select: {
        id: true;
        url: true;
        altText: true;
        isPrimary: true;
      };
      orderBy: {
        isPrimary: "desc";
      };
    };
    variants: {
      where: {
        isActive: true;
      };
      orderBy: {
        createdAt: "asc";
      };
      select: {
        id: true;
        sku: true;
        attributes: true;
        stock: true;
        minThreshold: true;
        maxThreshold: true;
        costPrice: true;
        originalPrice: true;
        discountAmount: true;
        discountType: true;
        discountValue: true;
        isActive: true;
        lastRestockedAt: true;
      };
    };
  };
}>;

const serializeProduct = (product: ProductWithRelations) => {
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
};

const buildVariantData = (variant: TProductOutput["variants"][number]) => {
  const attributes = Object.fromEntries(
    variant.attributeRows
      .filter((row) => row.key && row.value)
      .map((row) => [row.key, row.value]),
  );

  const discountAmount =
    variant.discountValue !== undefined
      ? variant.discountType === DiscountType.FIXED
        ? Number(variant.discountValue.toFixed(2))
        : Number((variant.originalPrice * variant.discountValue / 100).toFixed(2))
      : null;

  return {
    sku: variant.sku,
    attributes,
    stock: variant.stock,
    minThreshold: variant.minThreshold,
    maxThreshold: variant.maxThreshold,
    costPrice: variant.costPrice,
    originalPrice: variant.originalPrice,
    discountType: variant.discountType || null,
    discountValue: variant.discountValue ?? null,
    discountAmount,
    supplierId: variant.supplierId?.trim() || null,
    isActive: true,
  };
};

const findByCategoryName = async (name: string) =>
  prisma.category.findFirst({ where: { name } });

export const createProduct = async (data: unknown) => {
  try {
    const user = await isAuthenticated();

    if (!user || user.role !== Role.ADMIN) {
      return {
        success: false,
        message: "You have no permission to perform this action!",
      };
    }

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

    const skus = validatedData.variants.map((variant) => variant.sku);
    const existingSku = await prisma.productVariant.findFirst({
      where: { sku: { in: skus } },
      select: { sku: true },
    });

    if (existingSku) {
      return {
        success: false,
        message: `SKU ${existingSku.sku} is already in use!`,
        error: "SKU_EXISTS",
      };
    }

    let category = await findByCategoryName(validatedData.categoryName);

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: validatedData.categoryName,
          slug: uniqueSlug(generateSlug(validatedData.categoryName)),
        },
      });
    }

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
        images: {
          create: validatedData.imageUrls.map((image, index) => ({
            url: image.url,
            altText: validatedData.name,
            isPrimary: index === 0,
          })),
        },
        variants: {
          create: validatedData.variants.map(buildVariantData),
        },
      },
    });

    revalidatePath("/dashboard/products");
    revalidatePath("/dashboard/add-products");
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

export const updateProduct = async (productId: string, data: unknown) => {
  try {
    const user = await isAuthenticated();

    if (!user || user.role !== Role.ADMIN) {
      return {
        success: false,
        message: "You have no permission to perform this action!",
      };
    }

    const validatedData = productSchema.parse(data);

    const existingProduct = await prisma.product.findFirst({
      where: {
        name: validatedData.name,
        id: { not: productId },
      },
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
      where: {
        slug: requestedSlug,
        id: { not: productId },
      },
    });
    const slug = slugExists ? uniqueSlug(requestedSlug) : requestedSlug;

    const skus = validatedData.variants.map((variant) => variant.sku);
    const submittedVariantIds = validatedData.variants
      .map((variant) => variant.variantId)
      .filter((variantId): variantId is string => Boolean(variantId));

    const conflictingSkus = await prisma.productVariant.findMany({
      where: { sku: { in: skus } },
      select: { id: true, sku: true },
    });
    const submittedIdSet = new Set(submittedVariantIds);
    const conflict = conflictingSkus.find(
      (variant) => !submittedIdSet.has(variant.id),
    );

    if (conflict) {
      return {
        success: false,
        message: `SKU ${conflict.sku} is already in use!`,
        error: "SKU_EXISTS",
      };
    }

    let category = await findByCategoryName(validatedData.categoryName);

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: validatedData.categoryName,
          slug: uniqueSlug(generateSlug(validatedData.categoryName)),
        },
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: productId },
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
          images: {
            deleteMany: {},
            create: validatedData.imageUrls.map((image, index) => ({
              url: image.url,
              altText: validatedData.name,
              isPrimary: index === 0,
            })),
          },
        },
      });

      for (const variant of validatedData.variants) {
        if (variant.variantId) {
          await tx.productVariant.update({
            where: { id: variant.variantId, productId },
            data: buildVariantData(variant),
          });
        } else {
          await tx.productVariant.create({
            data: {
              ...buildVariantData(variant),
              productId,
            },
          });
        }
      }

      await tx.productVariant.updateMany({
        where:
          submittedVariantIds.length > 0
            ? {
                productId,
                id: { notIn: submittedVariantIds },
              }
            : { productId },
        data: { isActive: false },
      });
    });

    revalidatePath("/dashboard/products");
    revalidatePath("/dashboard/add-products");
    revalidatePath("/dashboard/edit-product");
    revalidatePath(`/dashboard/edit-product/${productId}`);
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Product updated successfully!",
    };
  } catch (error: unknown) {
    console.error("Error updating product:", error);

    return {
      success: false,
      message: "Failed to update product",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const user = await isAuthenticated();

    if (!user || user.role !== Role.ADMIN) {
      return {
        success: false,
        message: "You have no permission to perform this action!",
      };
    }

    const linkedVariant = await prisma.productVariant.findFirst({
      where: {
        productId,
        OR: [{ items: { some: {} } }, { restockItems: { some: {} } }],
      },
      select: { id: true },
    });

    if (linkedVariant) {
      return {
        success: false,
        message:
          "Product cannot be deleted because it has order or restock history.",
        error: "PRODUCT_HAS_HISTORY",
      };
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath("/dashboard/products");
    revalidatePath("/dashboard/add-products");
    revalidatePath("/dashboard/edit-product");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Product deleted successfully!",
    };
  } catch (error: unknown) {
    console.error("Error deleting product:", error);

    return {
      success: false,
      message: "Failed to delete product",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const getProductById = async (productId: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
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

    if (!product) return null;

    return serializeProduct(product);
  } catch (error: unknown) {
    console.error(
      "Error fetching product:",
      (error as Error | HttpError).message,
    );

    return null;
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

    return products.map(serializeProduct);
  } catch (error: unknown) {
    console.error(
      "Error fetching products:",
      (error as Error | HttpError).message,
    );

    return [];
  }
};