"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { getCategories, getIngredients } from "../action";
import { Sizes, TopCategory } from "@prisma/client";
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
import MultiSelectable, { Option } from "./MultiCreatable";
import { addItem } from "../lisa/actions";
import { toast } from "sonner";
import { sizeToText } from "@/utils/sizeToText";
import { arraysAreEqual } from "@/utils/arraysAreEqual";
import { arraysOfObjectsAreEqual } from "@/utils/arraysOfObjectsAreEqual";
import { updateItem } from "../[id]/actions";

const ImageSchema = z
  .custom<File>(
    (value) => {
      if (!(value instanceof File)) {
        return false;
      }
      const fileType = value.type;
      return (
        fileType === "image/jpeg" ||
        fileType === "image/png" ||
        fileType === "image/svg+xml" ||
        fileType === "image/webp"
      );
    },
    {
      message: "Peab olema pildifail.",
    }
  )
  .optional()
  .nullable();

const SizeSchema = z.object({
  name: z.nativeEnum(Sizes),
  price: z.string().min(1, { message: "Hind peab olema" }),
});

const ItemSchema = z.object({
  name: z.string().min(1, {
    message: "Nimi peab olema",
  }),
  image: ImageSchema,
  price: z.string().min(1, { message: "Hind peab olema" }),
  discountPrice: z.string().optional().nullable(),
  incredients: z.array(z.string()).optional().nullable(),
  addons: z.array(z.string()).optional().nullable(),
  sizes: z.array(SizeSchema).optional().nullable(),
  categoryId: z.string().min(1, { message: "Kategooria peab olema" }),
  topCategory: z.nativeEnum(TopCategory),
});

type InitialValues = z.infer<typeof ItemSchema> | undefined;

export default function ItemForm({
  initialValues,
  id,
  oldImage,
}: {
  initialValues: InitialValues;
  id: string | undefined;
  oldImage: string | null;
}) {
  //Fix for react-select
  const [isMounted, setIsMounted] = useState(false);
  const [optionSelected, setSelected] = useState<Option[] | null>();
  const [updateImage, setUpdateImage] = useState(false);

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

  const sizeOptions: { value: Sizes; label: string }[] = [
    { value: "s", label: "Väike" },
    { value: "m", label: "Keskmine" },
    { value: "l", label: "Suur" },
  ];

  const categorySelectionOptions =
    categoryData?.data?.map((category) => ({
      value: category.id,
      label: category.name,
    })) || [];

  const topCategoryOption = [
    { value: "Pizza", label: "Pitsa" },
    { value: "Else", label: "Muu" },
  ];

  const defaultValues: z.infer<typeof ItemSchema> = initialValues
    ? {
        ...initialValues,
        discountPrice:
          initialValues.discountPrice === null
            ? undefined
            : initialValues.discountPrice,
      }
    : {
        name: "",
        price: "",
        image: undefined,
        discountPrice: undefined,
        incredients: undefined,
        addons: undefined,
        sizes: undefined,
        categoryId: "",
        topCategory: "Else",
      };
  const form = useForm<z.infer<typeof ItemSchema>>({
    resolver: zodResolver(ItemSchema),
    defaultValues: defaultValues,
  });

  if (ingredientIsLoading || categoryIsLoading) return <div>Laeb...</div>;
  if (ingredientError || categoryError)
    return (
      <div>
        Tekkis viga: {ingredientError ? ingredientError.message : ""}{" "}
        {categoryError ? categoryError.message : ""}
      </div>
    );

  async function onSubmit(values: z.infer<typeof ItemSchema>) {
    //Item update
    if (initialValues && id) {
      const updatedData: Partial<z.infer<typeof ItemSchema>> = {};

      if (values.name !== initialValues.name) updatedData.name = values.name;
      if (values.price !== initialValues.price)
        updatedData.price = values.price;
      if (values.discountPrice !== initialValues.discountPrice) {
        if (values.discountPrice === "") {
          updatedData.discountPrice = null;
        } else updatedData.discountPrice = values.discountPrice;
      }
      if (values.topCategory !== initialValues.topCategory)
        updatedData.topCategory = values.topCategory;
      if (values.categoryId !== initialValues.categoryId)
        updatedData.categoryId = values.categoryId;
      if (updateImage) {
        if (values.image === undefined) {
          updatedData.image = null;
        } else updatedData.image = values.image;
      }
      if (!arraysAreEqual(values.incredients, initialValues.incredients)) {
        if (values.incredients === undefined) {
          updatedData.incredients = null;
        } else updatedData.incredients = values.incredients;
      }
      if (!arraysAreEqual(values.addons, initialValues.addons)) {
        if (values.addons === undefined) {
          updatedData.addons = null;
        } else updatedData.addons = values.addons;
      }
      if (
        values.sizes &&
        initialValues.sizes &&
        !arraysOfObjectsAreEqual(values.sizes, initialValues.sizes)
      ) {
        if (values.sizes === undefined) {
          updatedData.sizes = null;
        } else updatedData.sizes = values.sizes;
      }

      if (Object.keys(updatedData).length === 0) {
        toast.info("Muudatusi ei ole.");
        return;
      }

      const imageData = new FormData();
      if (updatedData.image && updateImage) {
        imageData.append("file", updatedData.image, updatedData.image.name);

        imageData.append("oldImage", oldImage ? oldImage : "");
      } else if (updateImage) {
        imageData.append("oldImage", oldImage ? oldImage : "");
      }

      const sendData = {
        image: imageData,
        name: updatedData.name,
        price: updatedData.price,
        discountPrice: updatedData.discountPrice,
        incredients: updatedData.incredients,
        addons: updatedData.addons,
        sizes: updatedData.sizes,
        categoryId: updatedData.categoryId,
        topCategory: updatedData.topCategory,
      };

      await updateItem(id, sendData)
        .then((data) => {
          if (data.error) {
            toast.error(data.error as any);
            return;
          }
          toast.success("Toode uuendatud");
        })
        .catch((error) => toast.error("Viga toote uuendamisel: " + error));

      return;
    }
    //Item add
    //Since File type can't be sent to server, need to wrap it into FormData to send it
    const imageData = new FormData();
    if (values.image) {
      imageData.append("file", values.image, values.image.name);
    }
    await addItem({
      data: {
        image: imageData,
        name: values.name,
        price: values.price,
        discountPrice: values.discountPrice,
        incredients: values.incredients,
        addons: values.addons,
        sizes: values.sizes,
        categoryId: values.categoryId,
        topCategory: values.topCategory,
      },
    })
      .then((data) => {
        if (data?.error) {
          toast.error(data.error as any);
          return;
        }
        toast.success("Uus toode lisatud");
      })
      .catch((error) => {
        toast.error("Viga toote lisamisel: " + error);
      });
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
                  <div>
                    <Input
                      {...fieldProps}
                      type="file"
                      accept="image/*"
                      onChange={(event) => onChange(event.target.files?.[0])}
                    />
                    {initialValues && (
                      <div>
                        <label>
                          <input
                            type="checkbox"
                            checked={updateImage}
                            onChange={(e) => setUpdateImage(e.target.checked)}
                          />
                          Kas soovite pilti uuendada?
                        </label>
                      </div>
                    )}
                  </div>
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
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Toote soodushind</FormLabel>
                <FormControl>
                  <Input
                    placeholder="60"
                    value={value ?? ""}
                    onChange={onChange}
                    {...fieldProps}
                  />
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
            name="topCategory"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Toote peakategooria (Pitsa/Muu)*</FormLabel>
                <FormControl>
                  {isMounted ? (
                    <Select
                      options={topCategoryOption}
                      {...fieldProps}
                      defaultValue={topCategoryOption.find(
                        (option) => option.value === defaultValues.topCategory
                      )}
                      onChange={(
                        event: SingleValue<{ value: string; label: string }>
                      ) => {
                        const selectedValue = event?.value;
                        onChange(selectedValue);
                      }}
                    ></Select>
                  ) : null}
                </FormControl>
                <FormDescription>Valige toote peakategooria.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
                      defaultValue={categorySelectionOptions.find(
                        (option) =>
                          String(option.value) === defaultValues.categoryId
                      )}
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
                    <Select
                      {...fieldProps}
                      options={ingredientSelectionOptions}
                      isMulti
                      defaultValue={ingredientSelectionOptions.filter(
                        (option) =>
                          defaultValues.incredients?.includes(
                            String(option.value)
                          )
                      )}
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
                    <MultiSelectable
                      {...fieldProps}
                      options={ingredientSelectionOptions}
                      value={optionSelected}
                      isSelectAll={true}
                      defaultValue={ingredientSelectionOptions.filter(
                        (option) =>
                          defaultValues.addons?.includes(String(option.value))
                      )}
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
                  <div>
                    {isMounted ? (
                      <Select
                        {...fieldProps}
                        options={sizeOptions}
                        isMulti
                        defaultValue={defaultValues.sizes?.map((size) => ({
                          value: size.name,
                          label: sizeToText(size.name),
                        }))}
                        onChange={(selectedOptions) => {
                          const sizesWithPriceInputs = selectedOptions.map(
                            (option) => ({
                              name: option.value,
                              price: "",
                            })
                          );
                          onChange(sizesWithPriceInputs);
                        }}
                      ></Select>
                    ) : null}

                    {value &&
                      value.map((size, index) => (
                        <div key={index} className="flex gap-4 pt-4">
                          <Input
                            type="text"
                            placeholder={`${sizeToText(size.name)} hind`}
                            value={size.price}
                            onChange={(e) => {
                              const newPrice = e.target.value;
                              const updatedSizes = [...value];
                              updatedSizes[index].price = newPrice;

                              onChange(updatedSizes);
                            }}
                          />
                        </div>
                      ))}
                  </div>
                </FormControl>
                <FormDescription>
                  Valige toote suurused ja sisestage iga suuruse hind.
                </FormDescription>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />

          <Button type="submit">{id ? "Uuenda toode" : "Lisa toode"}</Button>
        </form>
      </Form>
    </div>
  );
}
