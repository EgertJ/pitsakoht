"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { deleteUser, getUsers } from "../action";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { User } from "@prisma/client";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, MoreHorizontalIcon } from "lucide-react";
import UserUpdateForm, { InitialValues } from "./UserUpdateForm";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { toast } from "sonner";

export default function UsersTable() {
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [initialValues, setInitialValues] = useState<InitialValues | undefined>(
    undefined
  );
  const {
    data: usersData,
    error: usersError,
    isLoading: usersIsLoading,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  async function handleUserDelete(id: string) {
    await deleteUser(id)
      .then((data) => {
        if (data.error) {
          toast.error(data.error as any);
          return;
        }
        toast.success("Kasutaja kustutatud");
        refetch();
      })
      .catch((error) => toast.error("Viga kasutaja kusutamisel: " + error));
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "Id",
    },
    { accessorKey: "name", header: "Nimi" },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "emailVerified",
      header: "E-mail kinnitatud",
      accessorFn: (row) => (row.email_verified ? "Kinnitatud" : "Kinnitamata"),
    },
    {
      accessorKey: "role",
      header: "Roll",
      accessorFn: (row) => {
        if (row.role === "ADMIN") return "Admin";
        if (row.role === "USER") return "Kasutaja";
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
                  name: row.original.name,
                  email: row.original.email,
                  email_verified: row.original.email_verified,
                  role: row.original.role,
                });

                setOpenUpdateModal(true);
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
    data: usersData?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (usersError)
    return <div>Viga koostiosade kättesaamises: {usersError.message}</div>;
  if (usersIsLoading) return <div>Laeb...</div>;
  if (!usersData?.data) return <div>Viga koostiosade kättesaamises</div>;

  return (
    <div>
      <DeleteConfirmationModal
        open={openConfirmationModal}
        setOpen={setOpenConfirmationModal}
        onDelete={() => handleUserDelete(activeItem)}
      ></DeleteConfirmationModal>
      {initialValues && (
        <UserUpdateForm
          open={openUpdateModal}
          setOpen={setOpenUpdateModal}
          id={activeItem}
          initialValues={initialValues}
          refetch={() => refetch()}
        ></UserUpdateForm>
      )}

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
