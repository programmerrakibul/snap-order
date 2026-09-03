import Container from "@/components/shared/container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function MetricSkeleton() {
  return (
    <Card className="rounded-lg shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-3">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-3 w-36 rounded-md" />
          </div>
          <Skeleton className="size-10 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

function ChartSkeleton() {
  const bars = [62, 38, 78, 46, 88, 55, 70];

  return (
    <div className="w-full overflow-x-auto pb-1">
      <div className="relative flex h-72 min-w-110 items-end gap-2 rounded-lg border border-border/70 bg-muted/20 px-3 pb-3 pt-6 sm:gap-3 sm:px-4">
        <div className="pointer-events-none absolute inset-x-4 top-6 h-px bg-border/70" />
        <div className="pointer-events-none absolute inset-x-4 top-1/3 h-px bg-border/40" />
        <div className="pointer-events-none absolute inset-x-4 top-2/3 h-px bg-border/40" />

        {bars.map((height, index) => (
          <div
            key={`${height}-${index}`}
            className="relative z-10 flex min-w-12 flex-1 flex-col items-center gap-2"
          >
            <div className="flex h-52 w-full items-end rounded-md bg-background/80 px-1.5 py-1.5 shadow-inner ring-1 ring-border/60">
              <Skeleton
                className="w-full rounded-sm"
                style={{
                  height: `${height}%`,
                  animationDelay: `${index * 80}ms`,
                }}
              />
            </div>
            <div className="space-y-1">
              <Skeleton className="mx-auto h-3 w-8 rounded-md" />
              <Skeleton className="mx-auto h-3 w-10 rounded-md" />
            </div>
          </div>
        ))}

        <div className="absolute right-4 top-2 hidden items-center gap-2 sm:flex">
          <Skeleton className="h-3 w-16 rounded-md" />
          <Skeleton className="size-1 rounded-full" />
          <Skeleton className="h-3 w-14 rounded-md" />
        </div>
      </div>
    </div>
  );
}

function StatusSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-5 w-24 rounded-3xl" />
            <Skeleton className="h-4 w-6 rounded-md" />
          </div>
          <Skeleton
            className="h-2 rounded-full"
            style={{ width: `${90 - index * 11}%` }}
          />
        </div>
      ))}
    </div>
  );
}

function RowSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-40 rounded-md" />
        <Skeleton className="h-3 w-56 max-w-full rounded-md" />
      </div>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <Skeleton className="h-5 w-20 rounded-3xl" />
        <Skeleton className="h-4 w-14 rounded-md" />
      </div>
    </div>
  );
}

function CompactCardSkeleton() {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-5 w-16 rounded-3xl" />
      </div>
      <Skeleton className="mt-3 h-3 w-full rounded-md" />
      <Skeleton className="mt-2 h-4 w-32 rounded-md" />
    </div>
  );
}

const OverviewLoading = () => {
  return (
    <>
      <section className="pt-8">
        <Container>
          <div>
            <Skeleton className="h-9 w-64 max-w-full rounded-md" />
            <Skeleton className="mt-3 h-4 w-136 max-w-full rounded-md" />
          </div>
        </Container>
      </section>

      <section className="py-8">
        <Container>
          <div className="space-y-6">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <MetricSkeleton key={index} />
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
              <Card className="rounded-lg shadow-sm">
                <CardHeader className="flex-row items-center justify-between gap-3">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40 rounded-md" />
                    <Skeleton className="h-4 w-64 max-w-full rounded-md" />
                  </div>
                  <Skeleton className="h-5 w-24 rounded-3xl" />
                </CardHeader>
                <CardContent>
                  <ChartSkeleton />
                </CardContent>
              </Card>

              <Card className="rounded-lg shadow-sm">
                <CardHeader>
                  <Skeleton className="h-5 w-36 rounded-md" />
                  <Skeleton className="h-4 w-56 max-w-full rounded-md" />
                </CardHeader>
                <CardContent>
                  <StatusSkeleton />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
              <Card className="rounded-lg shadow-sm xl:col-span-2">
                <CardHeader className="flex-row items-center justify-between gap-3">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-36 rounded-md" />
                    <Skeleton className="h-4 w-48 rounded-md" />
                  </div>
                  <Skeleton className="h-8 w-28 rounded-4xl" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <RowSkeleton key={index} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-lg shadow-sm">
                <CardHeader>
                  <Skeleton className="h-5 w-32 rounded-md" />
                  <Skeleton className="h-4 w-40 rounded-md" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0 flex-1 space-y-2">
                            <Skeleton className="h-4 w-36 rounded-md" />
                            <Skeleton className="h-3 w-24 rounded-md" />
                          </div>
                          <Skeleton className="h-5 w-16 rounded-3xl" />
                        </div>
                        <Skeleton className="h-2 rounded-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-lg shadow-sm">
              <CardHeader className="flex-row items-center justify-between gap-3">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-36 rounded-md" />
                  <Skeleton className="h-4 w-56 max-w-full rounded-md" />
                </div>
                <Skeleton className="h-8 w-24 rounded-4xl" />
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <CompactCardSkeleton key={index} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
};

export default OverviewLoading;
