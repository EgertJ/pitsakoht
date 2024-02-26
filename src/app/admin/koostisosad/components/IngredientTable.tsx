"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getIngredients } from "../../tooted/action";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Ingredient } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { deleteIngredient } from "../action";
import { toast } from "sonner";
import IngredientFormModal, { InitialValues } from "./IngredientFormModal";

export default function IngredientTable() {
  const {
    data: ingredientData,
    error: ingredientError,
    isLoading: ingredientIsLoading,
    refetch,
  } = useQuery({
    queryKey: ["ingredients"],
    queryFn: () => getIngredients(),
  });

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [activeItem, setActiveItem] = useState(1);
  const [initialValues, setInitialValues] = useState<InitialValues | undefined>(
    undefined
  );
  async function handleIngredientDelete(id: number) {
    await deleteIngredient(id)
      .then(() => {
        toast.success("Koostiosa kustutatud.");
        refetch();
      })
      .catch((error) => toast.error(error));
  }

  const columns: ColumnDef<Ingredient>[] = [
    { accessorKey: "name", header: "Nimi" },
    {
      accessorKey: "price",
      header: "Hind",
      accessorFn: (row) => (row.price / 100).toFixed(2) + "€",
    },
    {
      accessorKey: "category",
      header: "Kategooria",
      accessorFn: (row) => (row.category === "sauce" ? "Kaste" : "Lisand"),
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
                setOpenConfirmationModal(true);
              }}
            >
              Kustuta
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => {
                setActiveItem(row.original.id);
                setInitialValues({
                  name: row.original.name,
                  price: row.original.price,
                  category: row.original.category,
                });

                handleModalChange(true);
              }}
            >
              Muuda
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleModalChange = (open: boolean) => {
    setOpenUpdateModal(open);

    if (!open) {
      setInitialValues(undefined);
    }
  };

  const table = useReactTable({
    data: ingredientData?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (ingredientError)
    return <div>Viga koostiosade kättesaamises: {ingredientError.message}</div>;
  if (ingredientIsLoading) return <div>Laeb...</div>;
  if (!ingredientData?.data) return <div>Viga koostiosade kättesaamises</div>;
  return (
    <div>
      <DeleteConfirmationModal
        open={openConfirmationModal}
        setOpen={setOpenConfirmationModal}
        onDelete={() => handleIngredientDelete(activeItem)}
      ></DeleteConfirmationModal>

      <div className="flex justify-end pb-2">
        <Button onClick={() => setOpenUpdateModal(true)}>Lisa toode</Button>
        <IngredientFormModal
          initialValues={initialValues ? initialValues : undefined}
          id={initialValues ? activeItem : undefined}
          refetch={() => refetch()}
          open={openUpdateModal}
          setOpen={handleModalChange}
        ></IngredientFormModal>
      </div>
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
