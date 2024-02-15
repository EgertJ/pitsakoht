"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import ButtonWithCounter from "./ui/ButtonWithCounter";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ItemParams } from "./ui/ItemCard";
import { useEffect, useState } from "react";
import Addon from "./ui/Addon";
import { AddonType, CartItem } from "@/lib/types";
import { Sizes } from "@prisma/client";
import { useCartStore } from "../../store";
import { toast } from "sonner";

export default function PizzaMaking({
  params,
  cartItem,
  triggerText,
  buttonStyle,
}: {
  params: ItemParams;
  cartItem: CartItem | undefined;
  triggerText: string;
  buttonStyle: string;
}) {
  const [count, setCount] = useState<number>(cartItem ? cartItem.quantity : 1);
  const [finalPrice, setFinalPrice] = useState<number>(
    cartItem ? cartItem.price * cartItem.quantity : params.itemPrice
  );
  const [selectedSize, setSelectedSize] = useState<{
    size: Sizes;
    price: number;
  }>(
    cartItem
      ? cartItem.size
        ? cartItem.size
        : params.itemSizes[0]
      : params.itemSizes[0]
  );

  const [cart, addToCart, increaseQuantity, removeFromCart] = useCartStore(
    (state) => [
      state.cart,
      state.addToCart,
      state.increaseQuantity,
      state.removeFromCart,
    ]
  );

  const [addonsPrice, setAddonsPrice] = useState(
    cartItem
      ? cartItem.addons.reduce(
          (accumulator, addon) =>
            accumulator + addon.addonPrice * addon.addonCount,
          0
        )
      : 0
  );

  const [selectedAddons, setSelectedAddons] = useState<AddonType[]>(
    cartItem ? cartItem.addons : []
  );

  useEffect(() => {
    const addonsPrice = selectedAddons.reduce(
      (total, addon) => total + addon.addonPrice * addon.addonCount,
      0
    );

    setAddonsPrice(addonsPrice);
    setFinalPrice((selectedSize.price + addonsPrice) * count);
  }, [count, selectedSize, selectedAddons]);

  const handleSizeChange = (sizeName: string) => {
    const newSize = params.itemSizes.find((size) => size.size === sizeName);
    if (newSize) {
      setSelectedSize(newSize);
    }
  };

  const handleAddAddon = (addon: AddonType) => {
    setSelectedAddons([...selectedAddons, addon]);
  };

  const handleRemoveAddon = (addonName: AddonType["addonName"]) => {
    setSelectedAddons(
      selectedAddons.filter((addon) => addon.addonName !== addonName)
    );
  };

  const handleUpdateAddon = (updatedAddon: AddonType) => {
    setSelectedAddons(
      selectedAddons.map((addon) =>
        addon.addonName === updatedAddon.addonName ? updatedAddon : addon
      )
    );
  };

  const handleAddToCart = () => {
    if (cartItem) removeFromCart(cartItem);

    const existingItemIndex = cart.findIndex(
      (item) =>
        item.item.itemId === params.itemId &&
        item.size?.size === selectedSize.size &&
        JSON.stringify(item.addons) === JSON.stringify(selectedAddons)
    );

    if (existingItemIndex !== -1 && !cartItem) {
      increaseQuantity(cart[existingItemIndex], count);
    } else {
      const item: CartItem = {
        id: Math.floor(Math.random() * 1000000) + 1,
        item: params,
        price: selectedSize.price + addonsPrice,
        size: selectedSize,
        quantity: count,
        addons: selectedAddons,
      };

      addToCart(item);
      toast.success("Pitsa lisatud ostukorvi");
    }
  };

  const handleOpenChange = (e: boolean) => {
    if (e === false) {
      setSelectedAddons([]);
      setCount(1);
    }
  };
  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className={buttonStyle}> {triggerText} </Button>
      </DialogTrigger>

      <DialogContent className={" overflow-y-auto max-h-screen "}>
        <DialogHeader>
          <DialogTitle>
            <div className="relative h-60 w-full overflow-hidden ">
              <div className="w-full h-full relative">
                {params.itemImage && (
                  <Image
                    src={params.itemImage}
                    alt={params.itemName}
                    fill={true}
                    className="object-contain"
                    sizes="(max-width: 768px) 5rem, (max-width: 1024px) 5rem, 5rem"
                  />
                )}
              </div>
            </div>
          </DialogTitle>
          <DialogDescription className="font-bold text-3xl text-black">
            {params.itemName}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-8 ">
          <p className="text-red-500">{(params.itemPrice / 100).toFixed(2)}€</p>
          <p>{params.itemIngredients.join(", ")}</p>

          <div className="flex flex-col gap-4">
            <p className="font-bold">Vali suurus</p>
            <div>
              <RadioGroup
                className="flex-col gap-4"
                defaultValue={selectedSize.size}
                onValueChange={handleSizeChange}
              >
                {params.itemSizes.map((size, index) => {
                  let sizeName: string = "";
                  let sizeNumber: string = "";
                  let sizePrice: number = 0;
                  if (size.size == "s") {
                    sizeName = "Väike";
                    sizeNumber = "23cm";
                  } else if (size.size == "m") {
                    sizeName = "Keskmine";
                    sizeNumber = "30cm";
                  } else if (size.size == "l") {
                    sizeName = "Suur";
                    sizeNumber = "40cm";
                  }

                  if (index > 0) {
                    sizePrice = size.price - params.itemSizes[index - 1].price;
                  }

                  return (
                    <div className="flex gap-4" key={size.size}>
                      <RadioGroupItem
                        value={size.size}
                        id={size.size}
                      ></RadioGroupItem>
                      <Label htmlFor={sizeName}>{`${sizeName} ${sizeNumber} ${
                        sizePrice > 0
                          ? "+" + (sizePrice / 100).toFixed(2) + "€"
                          : ""
                      }`}</Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
            <div className="gap-2 flex flex-col">
              <p className="font-bold">Vali lisandid</p>
              <p className="text-sm">Max 5 lisandit</p>
            </div>
            <div className="flex flex-col gap-4">
              {params.itemAddons.map((item, index) => (
                <div key={index}>
                  <Addon
                    itemId={item.id}
                    incredientName={item.name}
                    incredientPrice={item.price}
                    selectedAddons={selectedAddons}
                    handleAddAddon={handleAddAddon}
                    handleRemoveAddon={handleRemoveAddon}
                    handleUpdateAddon={handleUpdateAddon}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-start w-full">
          <ButtonWithCounter
            buttonText={`Lisa ostukorvi hinnaga ${(finalPrice / 100).toFixed(
              2
            )}€`}
            type="button"
            count={count}
            setCount={setCount}
            onClick={handleAddToCart}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
