import Container from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutLoading() {
  return (
    <div className="space-y-8">
      <section className="pt-8">
        <Container>
          <div className="space-y-2">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-5 w-72 max-w-full" />
          </div>
        </Container>
      </section>

      <section className="pb-8">
        <Container>
          <Skeleton className="h-6 w-48 mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
            <div className="flex flex-col gap-6">
              {Array.from({ length: 2 }).map((_, cardIndex) => (
                <div
                  key={cardIndex}
                  className="rounded-lg border border-border p-6"
                >
                  <Skeleton className="h-5 w-40 mb-6" />
                  <div className="space-y-4">
                    <Skeleton className="h-11 w-full" />
                    <Skeleton className="h-11 w-full" />
                    <Skeleton className="h-11 w-full" />
                    <Skeleton className="h-11 w-full" />
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:sticky lg:top-4">
              <div className="rounded-lg border border-border p-6">
                <Skeleton className="h-5 w-36 mb-6" />
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-5 w-24 mb-4" />
                <Skeleton className="h-11 w-full" />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}