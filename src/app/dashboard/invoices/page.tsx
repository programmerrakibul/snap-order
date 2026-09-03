import { getAllInvoices } from "@/actions/server/invoice.action";
import InvoiceCard from "@/components/invoices/invoice-card";
import Container from "@/components/shared/container";
import { PageHeader } from "@/components/ui/page-header";
import { IconReceiptOff } from "@tabler/icons-react";
import { Metadata } from "next";
import { Suspense } from "react";
import InvoicesLoading from "./loading";

export const metadata: Metadata = {
  title: "My Invoices",
  description: "View and download receipts for your confirmed orders.",
  robots: { index: false, follow: false },
};

async function InvoicesPageContent() {
  const invoices = await getAllInvoices();

  return (
    <>
      <PageHeader
        title="My Invoices"
        description={
          invoices.length > 0
            ? `Download receipts for your ${invoices.length} generated invoice${
                invoices.length !== 1 ? "s" : ""
              }`
            : "Your generated invoices and receipts appear here once your orders are confirmed"
        }
      />

      <section className="py-8">
        <Container>
          {invoices.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {invoices.map((invoice) => (
                <InvoiceCard key={invoice.id} invoice={invoice} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed p-12 text-center">
              <IconReceiptOff className="size-10 text-muted-foreground" />
              <p className="text-lg font-medium">No invoices yet</p>
              <p className="max-w-md text-sm text-muted-foreground">
                Once one of your orders is confirmed by our team, a receipt will
                be generated here and available to download as a PDF.
              </p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

const InvoicesPage = () => {
  return (
    <Suspense fallback={<InvoicesLoading />}>
      <InvoicesPageContent />
    </Suspense>
  );
};

export default InvoicesPage;
