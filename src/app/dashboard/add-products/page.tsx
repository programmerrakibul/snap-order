import AddProductForm from "@/components/forms/add-product-form";
import Container from "@/components/shared/container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Product",
};

const AddProductPage = () => {
  return (
    <>
      <section>
        <Container>
          <AddProductForm />
        </Container>
      </section>
    </>
  );
};

export default AddProductPage;
