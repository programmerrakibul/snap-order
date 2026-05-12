export const dynamic = "force-dynamic";

import Container from "@/components/shared/container";
import { ProductsTable } from "@/components/tables/products-table";
import { API_BASE_URL } from "@/lib/exportURL";
import { TProduct } from "@/types/product.interface";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Products",
};

async function ProductsPage() {
  const res = await fetch(`${API_BASE_URL}/products`, {
    cache: "force-cache",
    credentials: "include",
    headers: {
      Cookie: (await cookies()).toString(),
    },
  });

  if (!res.ok) {
    return (
      <>
        <div className="grid h-full place-items-center">
          <div>
            <pre>
              {res.status} - {res.statusText}
            </pre>
          </div>
        </div>
      </>
    );
  }

  const products = (await res.json()).data as TProduct[];

  return (
    <div className="space-y-8">
      <section className="pt-8">
        <Container>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">
              {products.length > 0
                ? `Manage and view all your ${products.length} products`
                : "Manage and view all your products in one place"}
            </p>
          </div>
        </Container>
      </section>

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
  );
}

export default ProductsPage;
