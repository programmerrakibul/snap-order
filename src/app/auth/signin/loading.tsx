import Container from "@/components/shared/container";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoginFormLoading() {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <Container className="max-w-sm md:max-w-5xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <div className="space-y-6 p-6 md:p-8">
                <div className="flex flex-col items-center gap-2 text-center">
                  <Skeleton className="h-10 w-56" />
                  <Skeleton className="h-4 w-72" />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full rounded-3xl" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-3xl" />
                  </div>
                </div>

                <Skeleton className="h-12 w-full rounded-3xl" />

                <div className="flex items-center justify-center gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>

              {/* Image Side Skeleton */}
              <div className="relative hidden bg-muted md:block">
                <Skeleton className="absolute inset-0" />
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
