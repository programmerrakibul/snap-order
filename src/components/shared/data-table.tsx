"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export interface DataTableColumn<T> {
  header: string;
  accessor: keyof T;
  cell?: (value: T[keyof T], row: T) => React.ReactNode;
  className?: string;
  mobileHidden?: boolean;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  pageSize?: number;
  striped?: boolean;
  showPagination?: boolean;
}

export function DataTable<T extends object>({
  columns,
  data,
  pageSize = 10,
  striped = true,
  showPagination = true,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = data.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="w-full space-y-4">
      <div className="rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50">
              {columns.map((column) => (
                <TableHead
                  key={String(column.accessor)}
                  className={`${column.className || ""} whitespace-nowrap`}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((row, index) => (
                <TableRow
                  key={index}
                  className={striped && index % 2 === 0 ? "bg-muted/20" : ""}
                >
                  {columns.map((column) => {
                    const value = row[column.accessor];
                    return (
                      <TableCell
                        key={String(column.accessor)}
                        className={column.className}
                      >
                        {column.cell ? column.cell(value, row) : String(value)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-3 sm:px-4 py-3 bg-muted/30 rounded-lg border border-border">
          <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left order-2 sm:order-1">
            <div className="hidden sm:block">
              Page {currentPage} of {totalPages} • Showing{" "}
              {Math.min(endIndex, data.length)} of {data.length} items
            </div>
            <div className="sm:hidden">
              {currentPage} / {totalPages}
            </div>
          </div>
          <div className="flex gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="gap-1 text-xs h-8 px-2 sm:h-9 sm:px-3 sm:gap-2"
            >
              <span className="text-lg sm:text-base">←</span>
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="gap-1 text-xs h-8 px-2 sm:h-9 sm:px-3 sm:gap-2"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="text-lg sm:text-base">→</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
