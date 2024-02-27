"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Role } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Select, { SingleValue } from "react-select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteUser, updateUser } from "../action";

const UserSchema = z.object({
  name: z.string().min(1, {
    message: "Nimi peab olema",
  }),
  email: z.string().email({ message: "Ei ole õige e-mail" }),
  email_verified: z.boolean(),
  role: z.nativeEnum(Role),
});

export type InitialValues = z.infer<typeof UserSchema>;
export default function UserUpdateForm({
  initialValues,
  id,
  refetch,
  open,
  setOpen,
}: {
  id: string;
  initialValues: InitialValues;
  refetch: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);
  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, open]);

  const defaultValues: z.infer<typeof UserSchema> = {
    ...initialValues,
  };

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: defaultValues,
  });

  const roleSelectionOptions: {
    label: string;
    value: Role;
  }[] = [
    { label: "Admin", value: "ADMIN" },
    { label: "Kasutaja", value: "USER" },
  ];

  const emailVerifiedSelectionOptions: {
    label: string;
    value: boolean;
  }[] = [
    { label: "Kinnitatud", value: true },
    { label: "Kinnitamata", value: false },
  ];

  async function onSubmit(values: z.infer<typeof UserSchema>) {
    const updatedData: Partial<z.infer<typeof UserSchema>> = {};

    if (values.email !== initialValues.email) updatedData.email = values.email;
    if (values.email_verified !== initialValues.email_verified)
      updatedData.email_verified = values.email_verified;
    if (values.name !== initialValues.name) updatedData.name = values.name;
    if (values.role !== initialValues.role) updatedData.role = values.role;

    if (Object.keys(updatedData).length === 0) {
      toast.info("Muudatusi ei ole.");
      return;
    }

    await updateUser(id, updatedData)
      .then((data) => {
        if (data.error) {
          toast.error(data.error as any);
          return;
        }
        toast.success("Kasutaja andmed uuendatud");
        refetch();
      })
      .catch((error) =>
        toast.error("Viga kasutaja andmete uuendamisel: " + error)
      );
  }

  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
      <DialogContent>
        <div className="pt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kasutaja nimi</FormLabel>
                    <FormControl>
                      <Input placeholder="Toomas Annikas" {...field} />
                    </FormControl>
                    <FormDescription>Sisestage kasutaja nimi.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="toomasannikas@gmail.com" />
                    </FormControl>
                    <FormDescription>
                      Sisestage kasutaja e-mail.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="email_verified"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>E-mail kinnitatud</FormLabel>
                    <FormControl>
                      {isMounted ? (
                        <Select
                          options={emailVerifiedSelectionOptions}
                          {...fieldProps}
                          defaultValue={emailVerifiedSelectionOptions.find(
                            (option) =>
                              option.value === defaultValues.email_verified
                          )}
                          onChange={(
                            event: SingleValue<{
                              value: boolean;
                              label: string;
                            }>
                          ) => {
                            const selectedValue = event?.value;
                            onChange(selectedValue);
                          }}
                        ></Select>
                      ) : null}
                    </FormControl>
                    <FormDescription>
                      Sisestage kasutaja e-maili kinnituse väärtus.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="role"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Roll</FormLabel>
                    <FormControl>
                      {isMounted ? (
                        <Select
                          options={roleSelectionOptions}
                          {...fieldProps}
                          defaultValue={roleSelectionOptions.find(
                            (option) => option.value === defaultValues.role
                          )}
                          onChange={(
                            event: SingleValue<{
                              value: Role;
                              label: string;
                            }>
                          ) => {
                            const selectedValue = event?.value;
                            onChange(selectedValue);
                          }}
                        ></Select>
                      ) : null}
                    </FormControl>
                    <FormDescription>Valige roll.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <Button type="submit">Uuenda kasutaja</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
