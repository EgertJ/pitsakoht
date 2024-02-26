"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderWithItemsAndAddons } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import React, { useState } from "react";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { deleteOrder } from "../action";
import { toast } from "sonner";
import OrderDetailModal from "./OrderDetailModal";
import { statusToText } from "@/utils/statusToText";
import { getOrders } from "@/lib/shared/actions/actions";

export default function OrdersTable() {
  const {
    data: orderData,
    error: orderError,
    isLoading: orderIsLoading,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });

  const [activeItem, setActiveItem] = useState("");
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);

  const columns: ColumnDef<OrderWithItemsAndAddons>[] = [
    { accessorKey: "id", header: "Id" },
    {
      accessorKey: "createdAt",
      header: "Kuupäev",
      accessorFn: (row) => row.createdAt.toLocaleString("et-EE"),
    },
    { accessorKey: "name", header: "Nimi" },
    {
      accessorKey: "status",
      header: "Staatus",
      accessorFn: (row) => {
        return statusToText(row.status);
      },
    },
    {
      accessorKey: "total",
      header: "Kokku",
      accessorFn: (row) => (row.total / 100).toFixed(2) + "€",
    },
    {
      header: "Tegevused",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreHorizontalIcon className="w-4 h-4" />
              <span className="sr-only">Tegevused</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => {
                setActiveItem(row.original.id);
                setOpenDetailModal(true);
              }}
            >
              Vaata detaile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => {
                setActiveItem(row.original.id);
                setOpenConfirmationModal(true);
              }}
            >
              Kustuta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: orderData?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (orderError)
    return <div>Viga tellimuste kättesaamises. + {orderError.message}</div>;
  if (orderIsLoading) return <div>Laeb...</div>;
  if (!orderData?.data) return <div>Viga tellimuste kättesaamises.</div>;

  async function handleOrderDelete(id: string) {
    await deleteOrder(id)
      .then(() => {
        toast.success("Tellimus edukalt kustutatud");
        refetch();
      })
      .catch((error) => toast.error("Viga tellimuse kustutamisel:" + error));
  }

  return (
    <div>
      <DeleteConfirmationModal
        open={openConfirmationModal}
        setOpen={setOpenConfirmationModal}
        onDelete={() => handleOrderDelete(activeItem)}
      ></DeleteConfirmationModal>

      <OrderDetailModal
        open={openDetailModal}
        setOpen={setOpenDetailModal}
        orderDetails={orderData.data.find((order) => order.id === activeItem)}
      ></OrderDetailModal>

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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Eelmine
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Järgmine
        </Button>
      </div>
    </div>
  );
}
