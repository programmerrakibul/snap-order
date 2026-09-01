import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { STATUS_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { TInvoice } from "@/types/invoice.interface";
import {
  IconCalendar,
  IconPhone,
  IconReceipt,
  IconShip,
  IconTruck,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import DownloadReceiptButton from "./download-receipt-button";

interface InvoiceCardProps {
  invoice: TInvoice;
}

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "BDT",
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 2,
});

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function InvoiceCard({ invoice }: InvoiceCardProps) {
  const order = invoice.order;
  const statusConfig = STATUS_CONFIG[order.status];
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className="rounded-lg shadow-sm flex flex-col">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconReceipt className="size-4" />
              {order.orderNumber}
            </p>
            <p className="mt-1 truncate font-semibold text-primary">
              {money.format(invoice.totalAmount)}
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn("border", statusConfig.color)}
          >
            {statusConfig.label}
          </Badge>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <IconUser className="size-4 shrink-0" />
            <span className="truncate">{order.shippingName}</span>
          </p>
          <p className="flex items-center gap-2">
            <IconPhone className="size-4 shrink-0" />
            <span>{order.shippingPhone}</span>
          </p>
          <p className="flex items-center gap-2">
            <IconCalendar className="size-4 shrink-0" />
            <span>Issued {formatDate(invoice.createdAt)}</span>
          </p>
          <p className="flex items-center gap-2">
            <IconShip className="size-4 shrink-0" />
            <span>
              {totalItems} item{totalItems !== 1 ? "s" : ""}
            </span>
          </p>
          {order.shippedAt && (
            <p className="flex items-center gap-2">
              <IconTruck className="size-4 shrink-0" />
              <span>Shipped {formatDate(order.shippedAt)}</span>
            </p>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <Button asChild variant="ghost" size="sm" className="w-full sm:w-auto">
            <Link href={`/dashboard/orders`} title="View related order">
              View Order
            </Link>
          </Button>
          <div className="w-full sm:w-auto">
            <DownloadReceiptButton
              invoiceId={invoice.id}
              fileName={`${order.orderNumber}.pdf`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
