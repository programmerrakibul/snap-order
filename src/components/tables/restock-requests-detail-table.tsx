"use client";

import { DataTable, DataTableColumn } from "@/components/shared/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TRestockRequest,
  TRestockRequestItem,
} from "@/types/restock.interface";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface RestockRequestsDetailTableProps {
  request: TRestockRequest;
  approvedQuantities: Record<string, number>;
  handleQuantityChange: (itemId: string, value: string) => void;
}

const RestockRequestsDetailTable = ({
  request,
  approvedQuantities,
  handleQuantityChange,
}: RestockRequestsDetailTableProps) => {
  const columns: DataTableColumn<TRestockRequestItem>[] = [
    {
      header: "Product",
      accessor: "product",
      className: "font-medium",
      cell: (_value, row) => row.product.name,
    },
    {
      header: "Current Stock",
      accessor: "product",
      className: "text-center",
      cell: (_value, row) => (
        <Badge variant={row.product.stock > 0 ? "default" : "destructive"}>
          {row.product.stock}
        </Badge>
      ),
    },
    {
      header: "Requested Qty",
      accessor: "quantity",
      className: "text-center",
      cell: (value) => `+${String(value)}`,
    },
    {
      header: "Approved Qty",
      accessor: "quantity",
      className: "text-center",
      cell: (_value, row) => (
        <Input
          type="number"
          min={row.product.minThreshold - row.product.stock}
          value={approvedQuantities[row.id]}
          onChange={(event) => handleQuantityChange(row.id, event.target.value)}
          className="mx-auto max-w-30 text-center"
        />
      ),
    },
    {
      header: "Projected Stock",
      accessor: "product",
      className: "text-center",
      cell: (_value, row) =>
        row.product.stock + (approvedQuantities[row.id] ?? row.quantity),
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Restock Items</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable<TRestockRequestItem>
            columns={columns}
            data={request.items}
            pageSize={10}
            showPagination={false}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default RestockRequestsDetailTable;
