import Container from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersLoading() {
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

      <section className="pb-8">
        <Container>
          {/* Table Skeleton */}
          <div className="rounded-lg border border-border overflow-x-auto">
            {/* Header Row */}
            <div className="grid grid-cols-6 gap-4 border-b border-border px-4 py-3 bg-muted/50">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-20" />
              ))}
            </div>

            {/* Body Rows */}
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className={`grid grid-cols-6 gap-4 border-b border-border px-4 py-4 ${
                  rowIndex % 2 === 0 ? "bg-muted/20" : ""
                }`}
              >
                {Array.from({ length: 6 }).map((_, colIndex) => (
                  <Skeleton
                    key={colIndex}
                    className={`h-5 ${
                      colIndex === 1 ? "w-24" : colIndex === 0 ? "w-28" : "w-16"
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-between gap-4 px-4 py-3 bg-muted/30 rounded-lg border border-border mt-4">
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
