"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getLatestOrders } from "../action";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Order } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function LatestOrders<TData, TValue>() {
  const {
    data: orderData,
    error: orderError,
    isLoading: orderIsLoading,
  } = useQuery({
    queryKey: ["latestPurchases"],
    queryFn: () => getLatestOrders(10),
  });

  const columns: ColumnDef<Order>[] = [
    { accessorKey: "name", header: "Nimi", accessorFn: (row) => row.name },
    {
      accessorKey: "status",
      header: "Staatus",
      accessorFn: (row) => row.status,
    },
    {
      accessorKey: "createdAt",
      header: "Kuupäev",
      accessorFn: (row) => row.createdAt.toLocaleString("et-EE"),
    },
    {
      accessorKey: "total",
      header: "Kokku",
      accessorFn: (row) => (row.total / 100).toFixed(2) + "€",
    },
  ];

  const table = useReactTable({
    data: orderData?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (orderError)
    return <div>Viga ostude kättesaamisel: {orderError.message}</div>;
  if (orderIsLoading) return <div>Laeb...</div>;
  if (!orderData?.data) return <div>Viga ostude kättesaamisel.</div>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
