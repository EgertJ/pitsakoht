import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import PizzaMaking from "@/components/ui/PizzaMaking";
import { IngredientCategory, Sizes, TopCategory } from "@prisma/client";
import AddToCart from "./AddToCart";

export interface ItemParams {
  itemCategory: TopCategory;
  itemId: number;
  itemName: string;
  itemImage: string | null;
  itemIngredients: string[];
  itemPrice: number;
  itemDiscountPrice: number | null;
  itemAddons: {
    id: number;
    ingredientId: number;
    name: string;
    price: number;
    category: IngredientCategory;
  }[];
  itemSizes: {
    size: Sizes;
    price: number;
  }[];
}

export default function ItemCard(params: ItemParams) {
  return (
    <Card className="w-full h-full border-none">
      <CardHeader
        className={`p-0 h-56 relative ${params.itemImage ? "" : "bg-gray-100"}`}
      >
        {params.itemImage && (
          <Image
            src={params.itemImage}
            fill={true}
            alt={params.itemName}
            className="object-contain"
            sizes="(min-width: 768px) 50vw, 100vw"
          ></Image>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid w-full gap-8 justify-start">
          <h1 className="font-medium text-xl">{params.itemName}</h1>
          <p className="font-light">{params.itemIngredients.join(", ")}</p>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <p className="font-bold flex gap-2">
          <span className={params.itemDiscountPrice ? "line-through" : ""}>
            {(params.itemPrice / 100).toFixed(2)}€{" "}
          </span>
          {params.itemDiscountPrice ? (
            <span className="text-red-500">
              {(params.itemDiscountPrice / 100).toFixed(2)}€
            </span>
          ) : (
            ""
          )}
        </p>
        {params.itemCategory === "Pizza" && (
          <PizzaMaking
            params={params}
            cartItem={undefined}
            triggerText="Vali"
            buttonStyle="w-1/2"
          />
        )}

        {params.itemCategory === "Else" && (
          <AddToCart item={params}></AddToCart>
        )}
      </CardFooter>
    </Card>
  );
}
