"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/shared/data-table";
import { TRestockRequest } from "@/types";
import { IconEye } from "@tabler/icons-react";
import { formatDate } from "@/lib/utils";

interface RestockRequestsTableProps {
  requests: TRestockRequest[];
}

export default function RestockRequestsTable({
  requests,
}: RestockRequestsTableProps) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No pending restock requests found.
        </p>
      </div>
    );
  }

  const columns: DataTableColumn<TRestockRequest>[] = [
    {
      header: "Request ID",
      accessor: "id",
      className: "font-medium",
      cell: (value) => `#${String(value).slice(-8)}`,
    },
    {
      header: "Created",
      accessor: "createdAt",
      className: "text-center",
      cell: (value) => formatDate(new Date(String(value))),
    },
    {
      header: "Items",
      accessor: "items",
      className: "text-center",
      cell: (value) => String((value as TRestockRequest["items"]).length),
    },
    {
      header: "Status",
      accessor: "status",
      className: "text-center",
      cell: (value) => (
        <Badge variant="outline" className="capitalize">
          {String(value).toLowerCase()}
        </Badge>
      ),
    },
    {
      header: "Details",
      accessor: "updatedAt",
      className: "text-center",
      cell: (_value, row) => (
        <Link
          href={`/dashboard/restock-products/${row.id}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition hover:bg-primary/10"
          title="View request details"
        >
          <IconEye className="h-4 w-4" />
        </Link>
      ),
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Pending Restock Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable<TRestockRequest>
          columns={columns}
          data={requests}
          pageSize={10}
          showPagination={true}
        />
      </CardContent>
    </Card>
  );
}
