"use client";

import {
  DataTable,
  type DataTableColumn,
} from "@/components/shared/data-table";
import { TableUser } from "@/types/user.interface";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface CustomersTableProps {
  users: TableUser[];
}

export function CustomersTable({ users }: CustomersTableProps) {
  const columns: DataTableColumn<TableUser>[] = [
    {
      header: "Photo",
      accessor: "photoURL",
      cell: (val) => (
        <Avatar className="overflow-hidden">
          <AvatarImage src={val as string} />
          <AvatarFallback>Avatar</AvatarFallback>
        </Avatar>
      ),
    },
    {
      header: "Name",
      accessor: "name",
      className: "font-medium",
    },
    {
      header: "Email",
      accessor: "email",
      cell: (value) => <span className="text-muted-foreground">{value}</span>,
      mobileHidden: true,
    },
    {
      header: "Phone Number",
      accessor: "phoneNumber",
      cell: (value) => (
        <span className="text-muted-foreground">{value || "N/A"}</span>
      ),
      mobileHidden: true,
    },
    {
      header: "Verified",
      accessor: "isVerified",
      cell: (value) => (
        <Badge variant={value ? "default" : "destructive"}>
          {value ? "Yes" : "No"}
        </Badge>
      ),
      mobileHidden: true,
    },
    {
      header: "Registered",
      accessor: "createdAt",
      cell: (value) => {
        const date = new Date(value as string);

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
  ];

  return (
    <>
      <DataTable<TableUser>
        columns={columns}
        data={users}
        pageSize={10}
        showPagination={true}
      />
    </>
  );
}
