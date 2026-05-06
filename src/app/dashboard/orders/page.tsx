import Container from "@/components/shared/container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders",
};

const OrdersPage = () => {
  return (
    <>
      <section>
        <Container>
          <h1>Orders</h1>
        </Container>
      </section>
    </>
  );
};

export default OrdersPage;
