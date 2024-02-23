"use client";

import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from "../../../store";
import Image from "next/image";
import { Button } from "./button";
import PizzaMaking from "./PizzaMaking";
import { ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { sizeToText } from "@/utils/sizeToText";

export default function ShoppingCart({
  className,
  icon,
}: {
  className: string;
  icon: boolean;
}) {
  const [cart, increaseQuantity, decreaseQuantity] = useCartStore((state) => [
    state.cart,
    state.increaseQuantity,
    state.decreaseQuantity,
  ]);

  const [finalPrice, setFinalPrice] = useState(
    cart.reduce(
      (accumulator, currentItem) =>
        accumulator + currentItem.price * currentItem.quantity,
      0
    )
  );

  useEffect(() => {
    const finalPrice = cart.reduce(
      (accumulator, currentItem) =>
        accumulator + currentItem.price * currentItem.quantity,
      0
    );

    setFinalPrice(finalPrice);
  }, [cart]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className={className}>
          {icon ? <ShoppingBasket /> : <p>Ostukorv ({cart.length})</p>}
        </Button>
      </SheetTrigger>
      <SheetContent className={" overflow-y-auto max-h-screen "}>
        <SheetHeader>
          <SheetTitle>Ostukorv ({cart.length})</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col">
          {cart.map((item, index) => (
            <div className="flex flex-col relative py-10 gap-4" key={item.id}>
              <div className="flex border-b-2 py-4 items-center">
                <div className="w-24 h-16 relative">
                  {item.item.itemImage && (
                    <Image
                      src={item.item.itemImage}
                      alt={item.item.itemName}
                      fill
                      sizes="(max-width: 768px) 5rem, (max-width: 1024px) 5rem, 5rem"
                    />
                  )}
                </div>
                <div className="flex flex-col flex-1">
                  <h1 className="font-bold">
                    {item.item.itemName} x{item.quantity}
                  </h1>
                  {item.size && (
                    <p className="text-sm">{sizeToText(item.size.size)}</p>
                  )}

                  {item.addons.map((addon) => (
                    <p key={addon.addonId} className="text-sm font-light">
                      {addon.addonName} x{addon.addonCount}
                    </p>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p>{((item.price * item.quantity) / 100).toFixed(2)}€</p>
                </div>
                <div className="flex gap-4">
                  {item.item.itemCategory == "Pizza" && (
                    <PizzaMaking
                      params={item.item}
                      cartItem={cart[index]}
                      triggerText="Muuda"
                      buttonStyle="bg-white text-primary hover:bg-white"
                    ></PizzaMaking>
                  )}

                  <div className="relative flex justify-between gap-4">
                    <button
                      type="button"
                      className="cursor-pointer h-full relative w-1/3 align-middle"
                      onClick={() => decreaseQuantity(item)}
                    >
                      -
                    </button>
                    <div className="align-middle relative text-sm flex items-center">
                      {item.quantity}
                    </div>
                    <button
                      type="button"
                      className="cursor-pointer h-full relative w-1/3 align-middle"
                      onClick={() => increaseQuantity(item, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <SheetFooter className="w-full">
          <div className="flex flex-col gap-4 w-full">
            <div className="flex justify-between font-bold">
              <p>Kokku</p>
              <p>{(finalPrice / 100).toFixed(2)}€</p>
            </div>
            <Button className="w-full" asChild>
              <Link href="/kinnita-tellimus">Tellimust vormistama</Link>
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
