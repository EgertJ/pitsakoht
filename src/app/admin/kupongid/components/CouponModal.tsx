"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Item, User } from "@prisma/client";
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
import { createCoupon, updateCoupon } from "../action";
import { toast } from "sonner";

const CouponSchema = z
  .object({
    code: z.string().min(1, { message: "Kood on vajalik" }),
    discount: z
      .number()
      .or(z.string().min(1, { message: "Soodustus on vajalik" })),
    itemId: z.number().nullable().optional(),
    userId: z.string().nullable().optional(),
  })
  .transform((data) => ({
    ...data,
    discount:
      typeof data.discount === "string"
        ? parseFloat(data.discount)
        : data.discount,
  }))
  .refine((data) => typeof data.discount == "number" || !isNaN(data.discount), {
    message: "Soodustus peab olema number.",
    path: ["discount"],
  })
  .refine((data) => data.discount >= 0 && data.discount <= 100, {
    message: "Soodustus peab olema protsent (0-100).",
    path: ["discount"],
  })
  .refine((data) => data.userId !== undefined || data.itemId !== undefined, {
    message: "Seotud kasutaja peab olema, kui seotud toodet pole.",
    path: ["userId"],
  })
  .refine((data) => data.userId !== undefined || data.itemId !== undefined, {
    message: "Seotud toode peab olema, kui seotud kasutajat pole.",
    path: ["itemId"],
  });

export type InitialValues = z.infer<typeof CouponSchema> | undefined;

export default function CouponModal({
  initialValues,
  itemData,
  userData,
  id,
  refetch,
  open,
  setOpen,
}: {
  id: number | undefined;
  initialValues: InitialValues;
  itemData: Item[];
  userData: User[];
  refetch: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    } else {
      form.reset(defaultValues);
    }
  }, [initialValues, open]);

  const defaultValues: z.infer<typeof CouponSchema> = initialValues
    ? {
        ...initialValues,
      }
    : {
        discount: 0,
        code: "",
        itemId: undefined,
        userId: undefined,
      };

  const form = useForm<z.infer<typeof CouponSchema>>({
    resolver: zodResolver(CouponSchema),
    defaultValues: defaultValues,
  });

  async function onSubmit(values: z.infer<typeof CouponSchema>) {
    if (initialValues && id) {
      const updatedData: Partial<z.infer<typeof CouponSchema>> = {};

      if (values.code !== initialValues.code) updatedData.code = values.code;
      if (values.discount !== initialValues.discount)
        updatedData.discount = values.discount;
      if (values.itemId !== initialValues.itemId) {
        if (values.itemId === undefined) {
          updatedData.itemId = null;
        } else updatedData.itemId = values.itemId;
      }
      if (values.userId !== initialValues.userId) {
        if (values.userId === undefined) {
          updatedData.userId = null;
        } else updatedData.userId = values.userId;
      }

      if (Object.keys(updatedData).length === 0) {
        toast.info("Muudatusi ei ole.");
        return;
      }

      await updateCoupon(id, updatedData)
        .then((data) => {
          if (data.error) {
            toast.error(data.error as any);

            return;
          }
          toast.success("Kupong uuendatud!");
          refetch();
        })
        .catch((error) => toast.error(error));

      return;
    }

    await createCoupon(values)
      .then((data) => {
        if (data.error) {
          toast.error(data.error as any);
          return;
        }
        toast.success("Kupong lisatud!");
        refetch();
      })
      .catch((error) => toast.error(error));
  }

  const itemSelectionOptions =
    itemData?.map((item) => ({
      value: item.id,
      label: item.name,
    })) || [];

  const userSelectionOptions = userData.map((user) => ({
    value: user.id,
    label: user.name,
  }));

  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
      <DialogContent>
        <div className="pt-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kood</FormLabel>
                    <FormControl>
                      <Input placeholder="Pitsa20" {...field} />
                    </FormControl>
                    <FormDescription>Sisestage kood.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soodustus</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Sisestage soodustus (sisestades 20, on soodustus 20%).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="userId"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Seotud kasutaja</FormLabel>
                    <FormControl>
                      {isMounted ? (
                        <Select
                          options={userSelectionOptions}
                          isClearable
                          {...fieldProps}
                          defaultValue={userSelectionOptions.find(
                            (option) => option.value === defaultValues.userId
                          )}
                          onChange={(
                            event: SingleValue<{
                              value: string;
                              label: string;
                            }>
                          ) => {
                            const selectedValue = event?.value;
                            onChange(selectedValue);
                          }}
                        ></Select>
                      ) : null}
                    </FormControl>
                    <FormDescription>Valige seotud kasutaja.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="itemId"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Seotud toode</FormLabel>
                    <FormControl>
                      {isMounted ? (
                        <Select
                          options={itemSelectionOptions}
                          isClearable
                          {...fieldProps}
                          defaultValue={itemSelectionOptions.find(
                            (option) => option.value === defaultValues.itemId
                          )}
                          onChange={(
                            event: SingleValue<{
                              value: number;
                              label: string;
                            }>
                          ) => {
                            const selectedValue = event?.value;
                            onChange(selectedValue);
                          }}
                        ></Select>
                      ) : null}
                    </FormControl>
                    <FormDescription>Valige seotud toode.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <Button type="submit">
                {initialValues ? "Uuenda kupong" : "Lisa kupong"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
