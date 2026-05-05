import Container from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <section className="pt-8">
        <Container>
          <div className="space-y-2">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-5 w-80 max-w-full" />
          </div>
        </Container>
      </section>

      {/* Table Skeleton */}
      <section className="pb-8">
        <Container>
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-4 md:p-6 space-y-4">
              {/* Desktop Table Header */}
              <div className="hidden md:flex gap-4 pb-4 border-b border-border">
                <Skeleton className="h-6 flex-1" />
                <Skeleton className="h-6 flex-1" />
                <Skeleton className="h-6 flex-1" />
                <Skeleton className="h-6 w-20" />
              </div>

              {/* Table Rows - Desktop */}
              <div className="hidden md:flex flex-col md:space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex gap-4 py-4 border-b border-border last:border-0"
                  >
                    <Skeleton className="h-5 flex-1" />
                    <Skeleton className="h-5 flex-1" />
                    <Skeleton className="h-5 flex-1" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>

              {/* Mobile Cards Skeleton */}
              <div className="md:hidden space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="border border-border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pagination Skeleton */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-muted/30 rounded-lg border border-border mt-4">
            <Skeleton className="h-4 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
