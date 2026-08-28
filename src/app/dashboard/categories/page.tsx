import { getAllCategories } from "@/actions/server/category.action";
import CategoryFormModal from "@/components/modals/category-form-modal";
import Container from "@/components/shared/container";
import CategoriesTable from "@/components/tables/categories-table";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { Metadata } from "next";
import { Suspense } from "react";
import CategoriesLoading from "./loading";

export const metadata: Metadata = {
  title: "Categories",
  robots: { index: false, follow: false },
};

async function CategoriesPageContent() {
  const categories = await getAllCategories();

  return (
    <div className="space-y-8">
      <section className="pt-8">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
              <p className="text-muted-foreground">
                {categories.length > 0
                  ? `Manage and organize your ${categories.length} product categories`
                  : "Manage and organize your product categories in one place"}
              </p>
            </div>

            <CategoryFormModal
              Trigger={
                <Button size="lg" className="w-full sm:w-auto">
                  <IconPlus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              }
            />
          </div>
        </Container>
      </section>

      <section className="pb-8">
        <Container>
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-3 sm:p-4 md:p-6 lg:p-8">
              <CategoriesTable categories={categories} />
            </div>
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No categories found. Create your first category to get started.
              </p>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<CategoriesLoading />}>
      <CategoriesPageContent />
    </Suspense>
  );
}
