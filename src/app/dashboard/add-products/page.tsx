import AddProductForm from "@/components/forms/add-product-form";
import Container from "@/components/shared/container";
import { PageHeader } from "@/components/ui/page-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Product",
};

const AddProductPage = () => {
  return (
    <>
      <PageHeader
        title="Add New Product"
        description="Fill in the details below to add a new product to your inventory."
      />

      <section>
        <Container>
          <AddProductForm />
        </Container>
      </section>
    </>
  );
};

export default AddProductPage;
