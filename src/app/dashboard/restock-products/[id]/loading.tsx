import Container from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";

const RestockRequestDetailLoading = () => {
  return (
    <section className="pb-8">
      <Container>
        <div className="space-y-6 py-12">
          <div className="space-y-3">
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-5 w-96 max-w-full" />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-24 rounded-lg" />
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <div className="p-4 space-y-4">
              <Skeleton className="h-8 w-56" />
              <div className="grid gap-4 text-center sm:grid-cols-5">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>

              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="grid gap-4 items-center text-center sm:grid-cols-5"
                >
                  <Skeleton className="h-10 w-full rounded-md" />
                  <Skeleton className="h-10 w-full rounded-md" />
                  <Skeleton className="h-10 w-full rounded-md" />
                  <Skeleton className="h-10 w-full rounded-md" />
                  <Skeleton className="h-10 w-10 rounded-full mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default RestockRequestDetailLoading;
