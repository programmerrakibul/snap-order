import Container from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function RestockProductsLoading() {
  return (
    <div className="space-y-8 py-8">
      <section>
        <Container>
          <div className="space-y-3">
            <Skeleton className="h-10 w-52" />
            <Skeleton className="h-5 w-96 max-w-full" />
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <Card className="w-full">
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-52" />
                </div>
                <Skeleton className="h-10 w-24 rounded-md" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-5 gap-4 pb-4 border-b border-border">
                    <Skeleton className="h-5" />
                    <Skeleton className="h-5" />
                    <Skeleton className="h-5" />
                    <Skeleton className="h-5" />
                    <Skeleton className="h-5" />
                  </div>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-5 gap-4 py-3 items-center"
                    >
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>
    </div>
  );
}
