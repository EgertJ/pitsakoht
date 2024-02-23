"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { deleteItem, getItems } from "../action";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ItemWithSizesIngredientsAndAddons } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";

export default function ItemsTable() {
  const {
    data: itemData,
    error: itemError,
    isLoading: itemIsLoading,
    refetch,
  } = useQuery({
    queryKey: ["items"],
    queryFn: () => getItems(),
  });

  async function handleItemDelete(id: number) {
    await deleteItem(id)
      .then((item) => {
        refetch();
        return toast.success(item.data?.name + " kustutatud");
      })
      .catch((error) => {
        return toast.error(error);
      });
  }

  const columns: ColumnDef<ItemWithSizesIngredientsAndAddons>[] = [
    {
      accessorKey: "image",
      header: "Pilt",

      cell: ({ row }) => {
        if (!row.original.image) return <div></div>;
        return (
          <Image
            alt="tootePilt"
            src={row.original.image}
            height={100}
            width={100}
            className="h-auto w-auto"
          ></Image>
        );
      },
    },
    { accessorKey: "name", header: "Nimi" },
    {
      accessorKey: "topCategory",
      header: "Peakategooria",
      accessorFn: (row) => {
        return row.topCategory === "Pizza" ? "Pitsa" : "Muu";
      },
    },
    { accessorKey: "category.name", header: "Kategooria" },
    {
      accessorKey: "price",
      header: "Hind",
      accessorFn: (row) => (row.price / 100).toFixed(2) + "€",
    },
    {
      accessorKey: "discountPrice",
      header: "Soodushind",
      accessorFn: (row) =>
        row.discountPrice
          ? (row.discountPrice / 100).toFixed(2) + "€"
          : "puudub",
    },
    {
      header: "Tegevused",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreHorizontalIcon className="w-4 h-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={() => handleItemDelete(row.original.id)}
            >
              Kustuta
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">
              Muuda
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({
    data: itemData?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (itemError)
    return <div>Viga toodete kättesaamisel: {itemError.message}</div>;
  if (itemIsLoading) return <div>Laeb...</div>;
  if (!itemData?.data)
    return <div>Viga toodete kättesaamisel. Proovi uuesti</div>;

  return (
    <div>
      <div className="flex justify-end pb-2">
        <Button asChild>
          <Link href="/admin/tooted/lisa">Lisa toode</Link>
        </Button>
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
    </div>
  );
}
