import { OrderStatus } from "@/generated/prisma/enums";
import { Badge } from "@/components/ui/badge";
import { STATUS_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function StatusBreakdown({
  data,
}: {
  data: { status: OrderStatus; count: number }[];
}) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-4">
      {data.map((item) => {
        const config = STATUS_CONFIG[item.status];
        const width = total ? (item.count / total) * 100 : 0;

        return (
          <div key={item.status} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Badge variant="outline" className={cn("border", config.color)}>
                {config.label}
              </Badge>
              <span className="text-sm font-medium">{item.count}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.max(width, item.count ? 7 : 0)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
