"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { getCategories, getIngredients } from "../../action";
import { TopCategory } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Select, { MultiValue, SingleValue } from "react-select";
import Creatable, { useCreatable } from "react-select/creatable";
import MultiCreatable, { Option } from "./MultiCreatable";

const ImageSchema = z
  .custom<File>(
    (value) => {
      if (!(value instanceof File)) {
        return false;
      }
      const fileType = value.type;
      return fileType === "image/*";
    },
    {
      message: "Peab olema pildifail.",
    }
  )
  .optional();

const SizeSchema = z.object({
  name: z.string(),
  price: z.number(),
});

const ItemSchema = z.object({
  name: z.string().min(1, {
    message: "Nimi peab olema",
  }),
  image: ImageSchema,
  price: z.string().min(1, { message: "Hind peab olema" }),
  discountPrice: z.string().optional(),
  incredients: z.array(z.string()).optional(),
  addons: z.array(z.string()).optional(),
  sizes: z.array(SizeSchema).optional(),
  categoryId: z.string().min(1, { message: "Kategooria peab olema" }),
  topCategory: z.nativeEnum(TopCategory),
});

export default function AddProduct() {
  //Fix for react-select
  const [isMounted, setIsMounted] = useState(false);
  const [optionSelected, setSelected] = useState<Option[] | null>();

  useEffect(() => setIsMounted(true), []);

  const {
    data: ingredientData,
    error: ingredientError,
    isLoading: ingredientIsLoading,
  } = useQuery({
    queryKey: ["ingredients"],
    queryFn: () => getIngredients(),
  });

  const {
    data: categoryData,
    error: categoryError,
    isLoading: categoryIsLoading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const ingredientSelectionOptions =
    ingredientData?.data?.map((ingredient) => ({
      value: ingredient.id,
      label: ingredient.name,
    })) || [];

  const sizeOptions = [
    { value: "s", label: "Väike" },
    { value: "m", label: "Keskmine" },
    { value: "l", label: "Suur" },
  ];

  const categorySelectionOptions =
    categoryData?.data?.map((category) => ({
      value: category.id,
      label: category.name,
    })) || [];

  if (ingredientIsLoading || categoryIsLoading) return <div>Laeb...</div>;
  if (ingredientError || categoryError)
    return (
      <div>
        Tekkis viga: {ingredientError ? ingredientError.message : ""}{" "}
        {categoryError ? categoryError.message : ""}
      </div>
    );

  const form = useForm<z.infer<typeof ItemSchema>>({
    resolver: zodResolver(ItemSchema),
    defaultValues: {
      name: "",
      price: "",
      image: undefined,
      discountPrice: "",
      incredients: [],
      addons: [],
      sizes: [],

      categoryId: "",
      topCategory: "Else",
    },
  });

  async function onSubmit(values: z.infer<typeof ItemSchema>) {
    console.log(values);
  }

  const handleChange = (selected: MultiValue<Option>) => {
    const mutableSelected = Array.from(selected);
    setSelected(mutableSelected);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Toote nimi*</FormLabel>
                <FormControl>
                  <Input placeholder="Hakklihapitsa" {...field} />
                </FormControl>
                <FormDescription>Sisestage toote nimi.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="image"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Toote pilt</FormLabel>
                <FormControl>
                  <Input
                    {...fieldProps}
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      onChange(event.target.files && event.target.files[0])
                    }
                  />
                </FormControl>
                <FormDescription>Sisestage toote pilt.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Toote hind*</FormLabel>
                <FormControl>
                  <Input placeholder={"5555"} {...field} />
                </FormControl>
                <FormDescription>
                  Sisestage toote hind sentides.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="discountPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Toote soodushind</FormLabel>
                <FormControl>
                  <Input placeholder="60" type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Sisestage toote soodushind sentides.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Toote kategooria*</FormLabel>
                <FormControl>
                  {isMounted ? (
                    <Creatable
                      options={categorySelectionOptions}
                      {...fieldProps}
                      onChange={(
                        event: SingleValue<{ value: number; label: string }>
                      ) => {
                        const selectedValue = event?.value;
                        onChange(selectedValue?.toString());
                      }}
                    ></Creatable>
                  ) : null}
                </FormControl>
                <FormDescription>
                  Valige toote kategooria või sisestage uus kategooria.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="incredients"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Toote koostisosad</FormLabel>
                <FormControl>
                  {isMounted ? (
                    <Creatable
                      {...fieldProps}
                      options={ingredientSelectionOptions}
                      isMulti
                      menuPlacement="top"
                      closeMenuOnSelect={false}
                      onChange={(
                        event: MultiValue<{ value: number; label: string }>
                      ) => {
                        const selectedValues = event.map((option) =>
                          option.value.toString()
                        );

                        onChange(selectedValues);
                      }}
                    />
                  ) : null}
                </FormControl>
                <FormDescription>
                  Valige toote koostisosad või sisestage uued koostisosad.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="addons"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Toote lubatud lisandid</FormLabel>
                <FormControl>
                  {isMounted ? (
                    <MultiCreatable
                      {...fieldProps}
                      options={ingredientSelectionOptions}
                      value={optionSelected}
                      isSelectAll={true}
                      menuPlacement="top"
                      closeMenuOnSelect={false}
                      onChange={(
                        event: MultiValue<{ value: number; label: string }>
                      ) => {
                        handleChange(event);
                        const selectedValues = event.map((option) =>
                          option.value.toString()
                        );
                        onChange(selectedValues);
                      }}
                    />
                  ) : null}
                </FormControl>
                <FormDescription>
                  Valige toote lubatud lisandid või sisestage uued lubatud
                  lisandid.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="sizes"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Toote suurused</FormLabel>
                <FormControl>
                  {isMounted ? (
                    <Select options={sizeOptions} isMulti></Select>
                  ) : null}
                </FormControl>
                <FormDescription>
                  Valige toote suurused ja sisestage iga suuruse hind.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Lisa toode</Button>
        </form>
      </Form>
    </div>
  );
}
