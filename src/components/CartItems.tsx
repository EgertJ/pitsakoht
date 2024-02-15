"use client";
import React from "react";
import { useCartStore } from "../../store";
import Image from "next/image";
import PizzaMaking from "./PizzaMaking";
import { Button } from "./ui/button";

export default function CartItems() {
  const [cart, increaseQuantity, decreaseQuantity] = useCartStore((state) => [
    state.cart,
    state.increaseQuantity,
    state.decreaseQuantity,
  ]);
  return (
    <div className="w-full">
      {cart.map((item) => (
        <div
          className="relative flex align-middle justify-between py-8 border-b border-b-[#e7e7e7] flex-col lg:flex-row"
          key={item.id}
        >
          <div className="flex align-middle flex-col md:flex-row justify-center md:justify-normal">
            <div className="flex justify-center">
              <div className="md:mr-8 flex justify-center align-middle w-64 h-48 relative  md:left-0">
                {item.item.itemImage && (
                  <Image
                    src={item.item.itemImage}
                    alt={item.item.itemName}
                    fill
                  ></Image>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-4 justify-between">
              <h1 className="font-bold flex justify-center md:block">
                {item.item.itemName}
              </h1>
              <p className="flex justify-center md:block">
                {item.item.itemIngredients.join(", ")}
              </p>
              {item.addons.length > 0 && (
                <p className="font-bold flex justify-center md:block">
                  Lisandid:
                </p>
              )}

              <p className="flex justify-center md:block">
                {item.addons
                  .map((addon) => addon.addonName + " x" + addon.addonCount)
                  .join(", ")}
              </p>
              <p className="flex justify-center md:block">
                {item.size && item.size.size}
              </p>
              <p className="font-bold flex justify-center md:block">
                {((item.price * item.quantity) / 100).toFixed(2)}€
              </p>
            </div>
          </div>

          <div className="flex items-center flex-col md:flex-row">
            {item.item.itemCategory == "Pizza" && (
              <PizzaMaking
                params={item.item}
                cartItem={item}
                triggerText="Muuda"
                buttonStyle="bg-white text-primary hover:bg-white p-0 md:p-4"
              ></PizzaMaking>
            )}
            <div className="flex gap-4 text-3xl">
              <Button
                className="text-xl"
                onClick={() => decreaseQuantity(item)}
              >
                -
              </Button>
              <span>{item.quantity}</span>
              <Button
                className="text-xl"
                onClick={() => increaseQuantity(item, 1)}
              >
                +
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
