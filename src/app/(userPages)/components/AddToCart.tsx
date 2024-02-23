"use client";
import React from "react";
import { useCartStore } from "@/../store";
import { ItemParams } from "./ItemCard";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/lib/types";
import { toast } from "sonner";

export default function AddToCart({ item }: { item: ItemParams }) {
  const [cart, addToCart, increaseQuantity, decreaseQuantity] = useCartStore(
    (state) => [
      state.cart,
      state.addToCart,
      state.increaseQuantity,
      state.decreaseQuantity,
    ]
  );

  const handleDecrease = () => {
    const existingItemIndex = cart.findIndex(
      (cartitem) => cartitem.item.itemId === item.itemId
    );

    if (existingItemIndex !== -1) {
      decreaseQuantity(cart[existingItemIndex]);
    }
  };

  const handleIncrease = () => {
    const existingItemIndex = cart.findIndex(
      (cartitem) => cartitem.item.itemId === item.itemId
    );

    if (existingItemIndex !== -1) {
      increaseQuantity(cart[existingItemIndex], 1);
    }
  };

  const handleAdd = () => {
    const cartitem: CartItem = {
      id: item.itemId,
      item: item,
      price: item.itemPrice,
      size: undefined,
      quantity: 1,
      addons: [],
    };

    addToCart(cartitem);

    toast.success("Toode lisatud ostukorvi");
  };

  const howManyInCart = cart.find(
    (cartitem) => cartitem.item.itemId === item.itemId
  )?.quantity;

  if (howManyInCart && howManyInCart > 0) {
    return (
      <div className="flex space-x-5 items-center">
        <Button onClick={handleDecrease}>-</Button>
        <span>{howManyInCart}</span>
        <Button onClick={handleIncrease}>+</Button>
      </div>
    );
  }

  return <Button onClick={handleAdd}>Lisa ostukorvi</Button>;
}
