import { getAllProducts } from "@/actions/server/product.action";
import Container from "@/components/shared/container";
import ProductsTable from "@/components/tables/products-table";
import { PageHeader } from "@/components/ui/page-header";
import { TProduct } from "@/types/product.interface";
import { Metadata } from "next";
import { Suspense } from "react";
import ProductsLoading from "./loading";

export const metadata: Metadata = {
  title: "Products",
  robots: { index: false, follow: false },
};

async function ProductsPageContent() {
  const products = (await getAllProducts()) as TProduct[];

  return (
    <>
      <div className="space-y-8">
        <PageHeader
          title="Products"
          description={
            products.length > 0
              ? `Manage and view all your ${products.length} products`
              : "Manage and view all your products in one place"
          }
        />

        <section className="pb-8">
          <Container>
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="p-3 sm:p-4 md:p-6 lg:p-8">
                <ProductsTable products={products} />
              </div>
            </div>

            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No products found.</p>
              </div>
            )}
          </Container>
        </section>
      </div>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsPageContent />
    </Suspense>
  );
}
