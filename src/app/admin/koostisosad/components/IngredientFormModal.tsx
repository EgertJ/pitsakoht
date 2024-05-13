"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { IngredientCategory } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Select, { SingleValue } from "react-select";
import { addIngredient, updateIngredient } from "../action";
import { toast } from "sonner";

const IngredientSchema = z
  .object({
    name: z.string().min(1, {
      message: "Nimi peab olema",
    }),
    price: z.string().or(z.number()),
    category: z.nativeEnum(IngredientCategory),
  })
  .transform((data) => ({
    ...data,
    price: typeof data.price === "string" ? parseFloat(data.price) : data.price,
  }))
  .refine((data) => typeof data.price == "number" || !isNaN(data.price), {
    message: "Hind peab olema number.",
    path: ["price"],
  });
export type InitialValues = z.infer<typeof IngredientSchema> | undefined;

export default function IngredientFormModal({
  initialValues,
  id,
  refetch,
  open,
  setOpen,
}: {
  id: number | undefined;
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
    } else {
      form.reset(defaultValues);
    }
  }, [initialValues, open]);

  const defaultValues: z.infer<typeof IngredientSchema> = initialValues
    ? {
        ...initialValues,
      }
    : {
        name: "",
        price: 0,
        category: "topping",
      };

  const form = useForm<z.infer<typeof IngredientSchema>>({
    resolver: zodResolver(IngredientSchema),
    defaultValues: defaultValues,
  });

  async function onSubmit(values: z.infer<typeof IngredientSchema>) {
    if (initialValues && id) {
      const updatedData: Partial<z.infer<typeof IngredientSchema>> = {};

      if (values.name !== initialValues.name) updatedData.name = values.name;
      if (values.price !== initialValues.price)
        updatedData.price = values.price;
      if (values.category !== initialValues.category)
        updatedData.category = values.category;

      if (Object.keys(updatedData).length === 0) {
        toast.info("Muudatusi ei ole.");
        return;
      }
      await updateIngredient(id, updatedData)
        .then((data) => {
          if (data.error) {
            toast.error(data.error as any);
            return;
          }
          toast.success("Koostiosa uuendatud");
          refetch();
        })
        .catch((error) => toast.error(error));

      return;
    }

    await addIngredient(values)
      .then((data) => {
        if (data.error) {
          toast.error(data.error as any);
          return;
        }
        toast.success("Koostiosa lisatud.");
        refetch();
      })
      .catch((error) => toast.error(error));
  }

  const categorySelectionOptions: {
    label: string;
    value: IngredientCategory;
  }[] = [
    { label: "Lisand", value: "topping" },
    { label: "Kaste", value: "sauce" },
  ];

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
                    <FormLabel>Koostiosa nimi</FormLabel>
                    <FormControl>
                      <Input placeholder="Sibul" {...field} />
                    </FormControl>
                    <FormDescription>Sisestage koostiosa nimi.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hind</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Sisestage toote hind.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="category"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Kategooria</FormLabel>
                    <FormControl>
                      {isMounted ? (
                        <Select
                          options={categorySelectionOptions}
                          {...fieldProps}
                          defaultValue={categorySelectionOptions.find(
                            (option) => option.value === defaultValues.category
                          )}
                          onChange={(
                            event: SingleValue<{
                              value: IngredientCategory;
                              label: string;
                            }>
                          ) => {
                            const selectedValue = event?.value;
                            onChange(selectedValue);
                          }}
                        ></Select>
                      ) : null}
                    </FormControl>
                    <FormDescription>Sisestage toote hind.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <Button type="submit">
                {initialValues ? "Uuenda koostiosa" : "Lisa koostisosa"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
