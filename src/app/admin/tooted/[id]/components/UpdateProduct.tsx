"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getItem } from "../actions";
import ItemForm from "../../components/ItemForm";

export default function UpdateProduct({ params }: { params: { id: string } }) {
  const {
    data: itemData,
    error: itemError,
    isLoading: itemIsLoading,
    refetch,
  } = useQuery({
    queryKey: ["item"],
    queryFn: () => getItem(params.id),
  });

  if (itemError) return <div>Viga toote saamises</div>;

  if (itemIsLoading) return <div>Laeb...</div>;

  if (itemData?.data) {
    const transformedInitialValues = {
      name: itemData.data.name,
      price: itemData.data.price.toString(),
      categoryId: itemData.data.categoryId.toString(),
      topCategory: itemData.data.topCategory,
      image: undefined,
      discountPrice: itemData.data.discountPrice
        ? itemData.data.discountPrice.toString()
        : "",
      incredients: itemData.data.incredients?.map((ingredient) =>
        ingredient.ingredientId.toString()
      ),
      addons: itemData.data.addons?.map((addon) =>
        addon.ingredientId.toString()
      ),
      sizes: itemData.data.sizes?.map((size) => ({
        name: size.value,
        price: size.price.toString(),
      })),
    };

    return (
      <ItemForm
        initialValues={transformedInitialValues}
        id={itemData.data.id.toString()}
        oldImage={itemData.data.image}
      ></ItemForm>
    );
  }

  return <div>Viga toote saamises</div>;
}
