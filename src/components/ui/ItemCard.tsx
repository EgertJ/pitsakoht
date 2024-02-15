import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import PizzaMaking from "../PizzaMaking";
import { Sizes, TopCategory } from "@prisma/client";
import ButtonWithCounter from "./ButtonWithCounter";
import AddToCart from "./AddToCart";

export interface ItemParams {
  itemCategory: TopCategory;
  itemId: number;
  itemName: string;
  itemImage: string | null;
  itemIngredients: string[];
  itemPrice: number;
  itemAddons: {
    id: number;
    name: string;
    price: number;
  }[];
  itemSizes: {
    size: Sizes;
    price: number;
  }[];
}

export default function ItemCard(params: ItemParams) {
  return (
    <Card className="w-full h-full border-none">
      <CardHeader className="p-0 h-56 relative bg-gray-100">
        {params.itemImage && (
          <Image
            src={params.itemImage}
            fill={true}
            alt={params.itemName}
            className="object-cover"
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
        <p className="font-bold">{(params.itemPrice / 100).toFixed(2)}€</p>
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
