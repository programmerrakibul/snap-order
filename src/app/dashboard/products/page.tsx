import { getAllProducts } from "@/actions/server/product.action";
import Container from "@/components/shared/container";
import { ProductsTable } from "@/components/shared/products-table";
import { TProduct } from "@/types/product.interface";

async function ProductsPage() {
  const products = (await getAllProducts()) as TProduct[];


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
              <p className="text-muted-foreground mb-4">
                No products found.
              </p>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

export default ProductsPage;
