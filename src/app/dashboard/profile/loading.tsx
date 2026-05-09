import Container from "@/components/shared/container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <section className="min-h-screen bg-linear-to-b from-background to-muted py-8 md:py-12">
      <Container>
        {/* Header Section Skeleton */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-64 rounded-lg" />
            <Skeleton className="h-6 w-96 rounded-lg" />
          </div>
        </div>

        {/* Main Profile Card */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card Skeleton */}
          <Card className="lg:col-span-1 overflow-hidden">
            <CardHeader className="border-b bg-muted/50 p-6">
              <div className="flex flex-col items-center gap-4 text-center">
                {/* Avatar Skeleton */}
                <Skeleton className="size-32 rounded-full" />

                {/* User Info Skeleton */}
                <div className="flex flex-col gap-3 w-full items-center">
                  <Skeleton className="h-8 w-32 rounded-lg" />

                  {/* Badges Skeleton */}
                  <div className="flex gap-2 justify-center">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <Skeleton className="h-12 w-full rounded-lg" />
            </CardContent>
          </Card>

          {/* Info Cards Skeleton */}
          <div className="lg:col-span-2 space-y-4">
            {/* Email Card Skeleton */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2 w-full">
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-6 w-40 rounded" />
                  <Skeleton className="h-3 w-32 rounded" />
                </div>
              </CardContent>
            </Card>

            {/* Phone Card Skeleton */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2 w-full">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-6 w-36 rounded" />
                  <Skeleton className="h-3 w-40 rounded" />
                </div>
              </CardContent>
            </Card>

            {/* Member Since Card Skeleton */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2 w-full">
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-6 w-44 rounded" />
                  <Skeleton className="h-3 w-28 rounded" />
                </div>
              </CardContent>
            </Card>

            {/* Last Login Card Skeleton */}
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2 w-full">
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-6 w-40 rounded" />
                  <Skeleton className="h-3 w-24 rounded" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Account Settings Skeleton */}
        <Card className="mt-8 bg-muted/50 border-muted">
          <CardContent className="p-6 space-y-3">
            <Skeleton className="h-7 w-48 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-4/5 rounded" />
            </div>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
