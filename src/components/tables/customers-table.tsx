"use client";

import {
  DataTable,
  type DataTableColumn,
} from "@/components/shared/data-table";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { TableUser } from "@/types/user.interface";

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
      cell: (value) => <>{value || "N/A"}</>,
    },
    {
      header: "Email",
      accessor: "email",
      cell: (value) => <span className="text-muted-foreground">{value}</span>,
    },
    {
      header: "Phone Number",
      accessor: "phoneNumber",
      cell: (value) => (
        <span className="text-muted-foreground">
          {(value as string) || "N/A"}
        </span>
      ),
    },
    {
      header: "Verified",
      accessor: "isVerified",
      cell: (value) => (
        <Badge variant={value ? "default" : "destructive"}>
          {value ? "Yes" : "No"}
        </Badge>
      ),
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
    },
    {
      header: "Last Login",
      accessor: "lastLoggedIn",
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
