import { getRestockRequestItems } from "@/actions/server/restock.action";
import Container from "@/components/shared/container";
import RestockRequestsTable from "@/components/tables/restock-requests-table";
import { Metadata } from "next";
import { Suspense } from "react";
import RestockProductsLoading from "./loading";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Restock Products",
  robots: { index: false, follow: false },
};

async function RestockProductsPageContent() {
  const requests = await getRestockRequestItems();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Restock Products"
        description={
          requests.length > 0
            ? `Manage ${requests.length} pending restock request${requests.length > 1 ? "s" : ""}`
            : "Manage and approve pending restock requests"
        }
      />

      <section className="pb-8">
        <Container>
          <RestockRequestsTable requests={requests} />
        </Container>
      </section>
    </div>
  );
}

export default function RestockProductsPage() {
  return (
    <Suspense fallback={<RestockProductsLoading />}>
      <RestockProductsPageContent />
    </Suspense>
  );
}
