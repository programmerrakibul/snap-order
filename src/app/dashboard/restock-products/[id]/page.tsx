import { getRestockRequestById } from "@/actions/server/restock.action";
import RestockRequestDetail from "@/components/restock/restock-request-detail";
import Container from "@/components/shared/container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Restock Request Details",
  robots: { index: false, follow: false },
};

interface props {
  params: Promise<{ id: string }>;
}

const RestockRequestDetailPage = async ({ params }: props) => {
  const { id } = await params;
  const request = await getRestockRequestById(id);

  return (
    <section className="py-8">
      <Container>
        {request ? (
          <RestockRequestDetail request={request} />
        ) : (
          <div className="py-20 text-center">
            <h1 className="text-2xl font-semibold">Request not found</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              The requested restock request does not exist or has been removed.
            </p>
          </div>
        )}
      </Container>
    </section>
  );
};

export default RestockRequestDetailPage;
