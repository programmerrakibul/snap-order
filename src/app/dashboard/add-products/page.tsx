import { getAllCategories } from "@/actions/server/category.action";
import AddProductForm from "@/components/forms/add-product-form";
import Container from "@/components/shared/container";
import { PageHeader } from "@/components/ui/page-header";
import { TCategory } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Product",
  robots: { index: false, follow: false },
};

const AddProductPage = async () => {
  const categories = (await getAllCategories()) as TCategory[];

  return (
    <>
      <PageHeader
        title="Add New Product"
        description="Fill in the details below to add a new product to your inventory."
      />

      <section>
        <Container>
          <AddProductForm categories={categories} />
        </Container>
      </section>
    </>
  );
};

export default AddProductPage;