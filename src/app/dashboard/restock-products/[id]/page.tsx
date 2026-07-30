import { getRestockRequestById } from "@/actions/server/restock.action";
import RestockRequestDetail from "@/components/restock/restock-request-detail";
import Container from "@/components/shared/container";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { Suspense } from "react";

interface props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Restock Request Details",
  robots: { index: false, follow: false },
};

export const generateStaticParams = async () => {
  try {
    const requests = await prisma.restockRequest.findMany({
      take: 1,
      select: { id: true },
      orderBy: { createdAt: "desc" },
    });

    if (requests.length > 0) return requests.map((r) => ({ id: r.id }));
  } catch {}
  return [{ id: "placeholder" }];
};

const RestockRequestDetailPageContent = async ({ params }: props) => {
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

const RestockRequestDetailPage = ({ params }: props) => {
  return (
    <Suspense
      fallback={
        <Container>
          <div className="py-20 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </Container>
      }
    >
      <RestockRequestDetailPageContent params={params} />
    </Suspense>
  );
};

export default RestockRequestDetailPage;
