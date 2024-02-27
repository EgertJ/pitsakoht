"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { deleteCoupon, getCoupons, getItems } from "../action";
import { getUsers } from "../../kasutajad/action";
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
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Coupon } from "@prisma/client";
import { MoreHorizontalIcon } from "lucide-react";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import CouponModal, { InitialValues } from "./CouponModal";
import { toast } from "sonner";

export default function CouponTable() {
  const {
    data: couponData,
    error: couponError,
    isLoading: couponIsLoading,
    refetch: couponRefetch,
  } = useQuery({
    queryKey: ["coupons"],
    queryFn: () => getCoupons(),
  });
  const {
    data: itemData,
    error: itemError,
    isLoading: itemIsLoading,
  } = useQuery({
    queryKey: ["items"],
    queryFn: () => getItems(),
  });
  const {
    data: userData,
    error: userError,
    isLoading: userIsLoading,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  const [activeItem, setActiveItem] = useState(0);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [initialValues, setInitialValues] = useState<InitialValues | undefined>(
    undefined
  );

  const handleModalChange = (open: boolean) => {
    setOpenUpdateModal(open);

    if (!open) {
      setInitialValues(undefined);
    }
  };

  async function handleCouponDelete(id: number) {
    await deleteCoupon(id)
      .then((data) => {
        if (data.error) {
          toast.error(data.error as any);
          return;
        }
        toast.success("Kupong kustutatud!");
        couponRefetch();
      })
      .catch((error) => toast.error(error));
  }

  if (couponError)
    return <div>Viga tellimuste kättesaamises. + {couponError.message}</div>;
  if (couponIsLoading) return <div>Laeb...</div>;
  if (!couponData?.data) return <div>Viga tellimuste kättesaamises.</div>;
  if (itemError)
    return <div>Viga toodete kättesaamises. + {itemError.message}</div>;
  if (itemIsLoading) return <div>Laeb...</div>;
  if (!itemData?.data) return <div>Viga toodete kättesaamises.</div>;
  if (userError)
    return <div>Viga kasutajate kättesaamises. + {userError.message}</div>;
  if (userIsLoading) return <div>Laeb...</div>;
  if (!userData?.data) return <div>Viga kastuajate kättesaamises.</div>;

  const columns: ColumnDef<Coupon>[] = [
    { accessorKey: "id", header: "Id" },
    { accessorKey: "code", header: "Kood" },
    { accessorKey: "discount", header: "Soodustus" },
    {
      accessorKey: "itemId",
      header: "Seotud toode",
      accessorFn: (row) => {
        const item = itemData?.data.find((item) => item.id === row.itemId);
        return item ? item.name : "Puudub";
      },
    },
    {
      accessorKey: "userId",
      header: "Seotud kasutaja",
      accessorFn: (row) => {
        const user = userData?.data.find((user) => user.id === row.userId);
        return user ? user.name : "Puudub";
      },
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
                  code: row.original.code,
                  discount: row.original.discount,
                  userId: row.original.userId ? row.original.userId : undefined,
                  itemId: row.original.itemId ? row.original.itemId : undefined,
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

  const table = useReactTable({
    data: couponData?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <DeleteConfirmationModal
        open={openConfirmationModal}
        setOpen={setOpenConfirmationModal}
        onDelete={() => handleCouponDelete(activeItem)}
      ></DeleteConfirmationModal>

      <div className="flex justify-end pb-2">
        <Button onClick={() => setOpenUpdateModal(true)}>Lisa kupong</Button>
        <CouponModal
          initialValues={initialValues ? initialValues : undefined}
          id={initialValues ? activeItem : undefined}
          refetch={() => couponRefetch()}
          open={openUpdateModal}
          setOpen={handleModalChange}
          itemData={itemData.data}
          userData={userData.data}
        ></CouponModal>
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
