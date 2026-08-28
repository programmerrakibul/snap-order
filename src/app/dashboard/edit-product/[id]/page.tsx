import {
  getAllCategories,
} from "@/actions/server/category.action";
import { getProductById } from "@/actions/server/product.action";
import AddProductForm from "@/components/forms/add-product-form";
import Container from "@/components/shared/container";
import { PageHeader } from "@/components/ui/page-header";
import { TCategory, TProduct } from "@/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import EditProductLoading from "./loading";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Product",
  robots: { index: false, follow: false },
};

async function EditProductPageContent({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getAllCategories(),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Edit Product"
        description={`Update product details and manage variants for ${product.name}`}
      />

      <section className="pb-8">
        <Container>
          <AddProductForm
            categories={categories as TCategory[]}
            product={product as TProduct}
          />
        </Container>
      </section>
    </div>
  );
}

export default function EditProductPage(props: EditProductPageProps) {
  return (
    <Suspense fallback={<EditProductLoading />}>
      <EditProductPageContent {...props} />
    </Suspense>
  );
}