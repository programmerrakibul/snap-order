"use client";

import { DataTable, DataTableColumn } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import CategoryFormModal from "@/components/modals/category-form-modal";
import { TCategory } from "@/types";
import { IconPencil } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface CategoriesTableProps {
  categories: TCategory[];
}

export default function CategoriesTable({ categories }: CategoriesTableProps) {
  const columns: DataTableColumn<TCategory>[] = [
    {
      header: "Image",
      accessor: "image",
      cell: (value, row) => (
        <Avatar className="overflow-hidden rounded-md">
          <AvatarImage src={(value as string) || undefined} />
          <AvatarFallback className="rounded-md">
            {row.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ),
    },
    {
      header: "Name",
      accessor: "name",
      className: "font-medium",
    },
    {
      header: "Slug",
      accessor: "slug",
      cell: (value) => (
        <span className="text-muted-foreground font-mono">{String(value)}</span>
      ),
    },
    {
      header: "Products",
      accessor: "productCount",
      cell: (value) => (
        <span className="text-muted-foreground">
          {Number(value)} product{Number(value) === 1 ? "" : "s"}
        </span>
      ),
    },
    {
      header: "Created",
      accessor: "createdAt",
      cell: (value) => {
        const date = new Date(String(value));

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
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (_value, row) => (
        <div className="flex items-center justify-center">
          <CategoryFormModal
            category={row}
            Trigger={
              <Button
                variant="ghost"
                size="sm"
                title="Edit Category"
                className="h-8 w-8 p-0 hover:bg-primary/10"
              >
                <IconPencil className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      ),
      className: "text-center",
    },
  ];

  return (
    <DataTable<TCategory>
      columns={columns}
      data={categories}
      pageSize={10}
      showPagination={true}
    />
  );
}