import Container from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditProductLoading() {
  return (
    <div className="space-y-8">
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
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8 space-y-5">
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-28 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-11 flex-1" />
                <Skeleton className="h-11 flex-1" />
              </div>
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-56 w-full" />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}