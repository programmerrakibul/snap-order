import { cn } from "@/lib/utils";
import { MetricCardProps } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({
  title,
  value,
  detail,
  icon: Icon,
  tone,
}: MetricCardProps) {
  return (
    <Card className="rounded-lg shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">
              {value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
          </div>
          <div className={cn("rounded-lg p-2.5", tone)}>
            <Icon className="size-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
