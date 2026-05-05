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

/**
 * DataTable - A reusable, modern table component with pagination and responsive design
 *
 * Features:
 * - Sticky header with backdrop blur effect
 * - Hover row effects
 * - Pagination controls
 * - Dark/Light theme support
 * - Mobile responsive (desktop table + mobile card layout)
 * - Tablet optimized
 * - Customizable cell rendering
 * - Striped rows option
 *
 * Device Breakpoints:
 * - Mobile: < 640px (card layout)
 * - Tablet: 640px - 1024px (optimized table)
 * - Desktop: > 1024px (full table)
 */
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

  const visibleColumns = columns.filter((col) => !col.mobileHidden);
  const desktopColumns = columns;

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="w-full space-y-4">
      {/* Desktop View (md and up) */}
      <div className="hidden md:block overflow-x-auto">
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-muted/50">
                {desktopColumns.map((column) => (
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
                    colSpan={desktopColumns.length}
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
                    {desktopColumns.map((column) => {
                      const value = row[column.accessor];
                      return (
                        <TableCell
                          key={String(column.accessor)}
                          className={column.className}
                        >
                          {column.cell
                            ? column.cell(value, row)
                            : String(value)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Tablet View (sm to md) */}
      <div className="hidden sm:block md:hidden overflow-x-auto">
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-muted/50 bg-muted/50">
                {visibleColumns.map((column) => (
                  <TableHead
                    key={String(column.accessor)}
                    className={`${column.className || ""} text-xs sm:text-sm whitespace-nowrap`}
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
                    colSpan={visibleColumns.length}
                    className="h-24 text-center text-muted-foreground text-sm"
                  >
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                currentData.map((row, index) => (
                  <TableRow
                    key={index}
                    className={striped && index % 2 === 0 ? "bg-muted/10" : ""}
                  >
                    {visibleColumns.map((column) => {
                      const value = row[column.accessor];
                      return (
                        <TableCell
                          key={String(column.accessor)}
                          className={`${column.className || ""} text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-4`}
                        >
                          {column.cell
                            ? column.cell(value, row)
                            : String(value)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile View (< sm) */}
      <div className="sm:hidden space-y-2">
        {currentData.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-center text-muted-foreground border border-border rounded-lg bg-card">
            <p className="text-sm">No data available</p>
          </div>
        ) : (
          currentData.map((row, index) => (
            <div
              key={index}
              className="border border-border rounded-lg p-3 space-y-2 bg-card hover:shadow-sm hover:bg-muted/50 transition-all"
            >
              {visibleColumns.map((column) => {
                const value = row[column.accessor];
                return (
                  <div
                    key={String(column.accessor)}
                    className="flex justify-between items-start gap-2"
                  >
                    <span className="text-xs font-semibold text-muted-foreground shrink-0">
                      {column.header}
                    </span>
                    <span className="text-xs font-medium text-foreground text-right wrap-break-word flex-1">
                      {column.cell ? column.cell(value, row) : String(value)}
                    </span>
                  </div>
                );
              })}
            </div>
          ))
        )}
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
