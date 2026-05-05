"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/shared/data-table";
import { ProductDetailModal } from "@/components/shared/product-detail-modal";
import { TProduct } from "@/types/product.interface";
import { IconEye, IconShoppingCart } from "@tabler/icons-react";

interface ProductsTableProps {
  products: TProduct[];
}

export function ProductsTable({ products }: ProductsTableProps) {
  const columns: DataTableColumn<TProduct>[] = [
    {
      header: "Product Name",
      accessor: "name",
      className: "font-medium",
    },
    {
      header: "Description",
      accessor: "description",
      cell: (value) => (
        <span className="text-muted-foreground line-clamp-2 max-w-xs">
          {value}
        </span>
      ),
      mobileHidden: true,
    },
    {
      header: "Price",
      accessor: "price",
      cell: (value) => (
        <span className="font-semibold text-primary">
          ${Number(value).toFixed(2)}
        </span>
      ),
      className: "text-right",
    },
    {
      header: "Stock",
      accessor: "stock",
      cell: (value) => (
        <Badge
          variant={(value as number) > 0 ? "default" : "destructive"}
          className="w-fit"
        >
          {(value as number) > 0 ? `${value} units` : "Out of stock"}
        </Badge>
      ),
      className: "text-center",
    },
    {
      header: "Created",
      accessor: "createdAt",
      cell: (value) => {
        const date = new Date(value);
        return (
          <span className="text-sm text-muted-foreground">
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        );
      },
      mobileHidden: true,
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (value) => (
        <div className="flex items-center justify-center gap-2">
          <ProductDetailModal
            productId={value as string}
            Trigger={
              <Button
                variant="ghost"
                size="sm"
                title="View Product"
                className="h-8 w-8 p-0 hover:bg-primary/10"
              >
                <IconEye className="h-4 w-4" />
              </Button>
            }
          />

          <Button
            variant="ghost"
            size="sm"
            title="Order Product"
            className="h-8 w-8 p-0 hover:bg-blue-500/10"
          >
            <IconShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: "text-center",
    },
  ];

  return (
    <>
      <DataTable<TProduct>
        columns={columns}
        data={products}
        pageSize={10}
        showPagination={true}
      />
    </>
  );
}
