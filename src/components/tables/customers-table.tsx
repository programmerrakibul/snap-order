"use client";

import {
  DataTable,
  type DataTableColumn,
} from "@/components/shared/data-table";
import { TableUser } from "@/types/user.interface";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

interface CustomersTableProps {
  users: TableUser[];
}

export default function CustomersTable({ users }: CustomersTableProps) {
  const columns: DataTableColumn<TableUser>[] = [
    {
      header: "Photo",
      accessor: "photoURL",
      cell: (val) => (
        <Avatar className="overflow-hidden">
          <AvatarImage src={val as string} />
          <AvatarFallback>User</AvatarFallback>
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
      cell: (value) => (
        <span className="text-muted-foreground">{String(value)}</span>
      ),
    },
    {
      header: "Phone Number",
      accessor: "phoneNumber",
      cell: (value) => (
        <span className="text-muted-foreground">{String(value) || "N/A"}</span>
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
      header: "Last Login",
      accessor: "lastLoggedIn",
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
