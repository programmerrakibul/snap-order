import { getCheckoutData } from "@/actions/server/order.action";
import CheckoutForm from "@/components/forms/checkout-form";
import Container from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import Link from "next/link";
import { Metadata } from "next";
import { Suspense } from "react";
import CheckoutLoading from "./loading";
import { cn } from "@/lib/utils";
import { IconArrowLeft } from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Review your item and complete your order.",
  robots: { index: false, follow: false },
};

interface CheckoutPageProps {
  searchParams: Promise<{ variantId?: string }>;
}

async function CheckoutPageContent({ searchParams }: CheckoutPageProps) {
  const { variantId } = await searchParams;

  if (!variantId) {
    return (
      <>
        <PageHeader title="Checkout" description="Complete your order" />
        <section className="py-20">
          <Container>
            <div className="text-center">
              <h2 className="text-xl font-semibold">No item selected</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Choose a product to start your order.
              </p>
              <Link
                href="/dashboard/products"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <IconArrowLeft className="h-4 w-4" />
                Back to products
              </Link>
            </div>
          </Container>
        </section>
      </>
    );
  }

  const data = await getCheckoutData(variantId);

  return (
    <>
      <PageHeader
        title="Checkout"
        description="Review your item and complete your order."
      />

      <section className="py-8">
        <Container>
          {!data ? (
            <div className="py-20 text-center">
              <h2 className="text-xl font-semibold">Item unavailable</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The selected product either no longer exists or is not
                available for ordering.
              </p>
              <Link
                href="/dashboard/products"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <IconArrowLeft className="h-4 w-4" />
                Back to products
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Product + variant switching */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold">{data.productName}</h2>
                  {data.selected.stock <= 0 && (
                    <Badge variant="outline" className="text-destructive border-destructive/40">
                      Out of stock
                    </Badge>
                  )}
                </div>

                {data.variants.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {data.variants.map((v) => {
                      const isSelected = v.variantId === data.selected.variantId;
                      const label =
                        Object.keys(v.attributes).length > 0
                          ? Object.values(v.attributes).join(" / ")
                          : v.sku;
                      return (
                        <Link
                          key={v.variantId}
                          href={`/dashboard/checkout?variantId=${v.variantId}`}
                          aria-current={isSelected}
                          className={cn(
                            "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition",
                            isSelected
                              ? "border-primary bg-primary/10 text-primary font-medium"
                              : "border-border text-muted-foreground hover:bg-muted",
                            v.stock <= 0 && "opacity-50 pointer-events-none",
                          )}
                          title={
                            v.stock <= 0
                              ? "This variant is out of stock"
                              : label
                          }
                        >
                          <span>{label}</span>
                          <span className="text-xs text-muted-foreground">
                            ({v.stock})
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              <CheckoutForm variant={data.selected} />
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

const CheckoutPage = ({ searchParams }: CheckoutPageProps) => {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutPageContent searchParams={searchParams} />
    </Suspense>
  );
};

export default CheckoutPage;