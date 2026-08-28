"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { TRestockRequest } from "@/types";
import { IconArrowLeft, IconCheck, IconX } from "@tabler/icons-react";
import {
  approveRestockRequest,
  cancelRestockRequest,
} from "@/actions/server/restock.action";
import { toast } from "sonner";
import RestockRequestsDetailTable from "@/components/tables/restock-requests-detail-table";
import RestockRequestCancelModal from "@/components/modals/restock-request-cancel-modal";

interface RestockRequestDetailProps {
  request: TRestockRequest;
}

export default function RestockRequestDetail({
  request,
}: RestockRequestDetailProps) {
  const router = useRouter();
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalRequested = request.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const [approvedQuantities, setApprovedQuantities] = useState(() =>
    request.items.reduce<Record<string, number>>((acc, item) => {
      acc[item.id] = item.quantity;
      return acc;
    }, {}),
  );

  const handleQuantityChange = (itemId: string, value: string) => {
    const nextValue = Math.max(0, Number(value));

    setApprovedQuantities((prev) => ({
      ...prev,
      [itemId]: Number.isNaN(nextValue) ? 0 : nextValue,
    }));
  };

  const handleApprove = async () => {
    setIsSubmitting(true);

    const items = request.items.map((item) => ({
      productVariantId: item.productVariantId,
      quantity: approvedQuantities[item.id] ?? item.quantity,
    }));

    const invalidItem = items.find((item) => item.quantity < 0);

    if (invalidItem) {
      toast.error("Approved quantities must be greater than 0.");
      setIsSubmitting(false);
      return;
    }

    const result = await approveRestockRequest({
      requestId: request.id,
      items,
    });

    setIsSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      router.push("/dashboard/restock-products");
    } else {
      toast.error(result.message);
    }
  };

  const handleCancel = async () => {
    setIsSubmitting(true);
    const result = await cancelRestockRequest(request.id);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      router.push("/dashboard/restock-products");
    } else {
      toast.error(result.message);
    }
  };

  const isDirty = useMemo(
    () =>
      request.items.some(
        (item) => approvedQuantities[item.id] !== item.quantity,
      ),
    [approvedQuantities, request.items],
  );

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <CardTitle className="text-2xl font-semibold">
            Restock Request Details
          </CardTitle>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Review each restock item, adjust the approved quantity if needed,
            and approve or cancel the request.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/dashboard/restock-products"
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-primary/10"
          >
            <IconArrowLeft className="h-4 w-4" />
            Back to restock requests
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Request Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Request ID
                </p>
                <p className="font-medium">{request.id}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Status
                </p>
                <Badge className="capitalize" variant="secondary">
                  {request.status.toLowerCase()}
                </Badge>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Created
                </p>
                <p>{new Date(request.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Items requested
                </p>
                <p>{request.items.length}</p>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-muted/10 p-4">
              <p className="text-sm text-muted-foreground">
                Total suggested restock quantity
              </p>
              <p className="mt-1 text-xl font-semibold text-primary">
                {totalRequested} unit{totalRequested > 1 ? "s" : ""}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full"
              onClick={handleApprove}
              disabled={isSubmitting}
            >
              <IconCheck className="mr-2 h-4 w-4" />
              Approve Request{isDirty ? " with adjustments" : ""}
            </Button>
            <RestockRequestCancelModal
              isCancelOpen={isCancelOpen}
              handleCancel={handleCancel}
              setIsCancelOpen={setIsCancelOpen}
              Trigger={
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setIsCancelOpen(true)}
                >
                  <IconX className="mr-2 h-4 w-4" />
                  Cancel Request
                </Button>
              }
            />
          </CardContent>
        </Card>
      </div>

      <RestockRequestsDetailTable
        request={request}
        approvedQuantities={approvedQuantities}
        handleQuantityChange={handleQuantityChange}
      />
    </div>
  );
}
