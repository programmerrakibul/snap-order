import { getAllOrders } from "@/actions/server/order.action";
import { Metadata } from "next";
import { Suspense } from "react";
import OrdersLoading from "./loading";
import { PageHeader } from "@/components/ui/page-header";
import Container from "@/components/shared/container";
import OrdersTable from "@/components/tables/orders-table";

export const metadata: Metadata = {
  title: "Orders",
};

async function OrdersPageContent() {
  const orders = await getAllOrders();

  return (
    <>
      <PageHeader
        title="Orders"
        description={
          orders.length > 0
            ? `Manage and view all your ${orders.length} orders`
            : "Manage and view all your orders in one place"
        }
      />

      <section className="py-8">
        <Container>
          <OrdersTable orders={orders} />
        </Container>
      </section>
    </>
  );
}

const OrdersPage = () => {
  return (
    <Suspense fallback={<OrdersLoading />}>
      <OrdersPageContent />
    </Suspense>
  );
};

export default OrdersPage;
