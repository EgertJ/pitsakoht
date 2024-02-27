"use client";

import React, { useEffect, useState } from "react";
import { useCartStore } from "@/../store";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { z } from "zod";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucia";
import { OrderType } from "@/lib/types";
import { toast } from "sonner";
import { createOrder, validateCoupon } from "../action";

const orderFormSchema = z.object({
  name: z.string().min(1, {
    message: "Nimi on vajalik.",
  }),
  email: z.string().email("See ei ole õige e-mail."),
  phone: z.string().min(1, {
    message: "Telefoninumber on vajalik.",
  }),
});

export default function CheckoutForm({ user }: { user: User | null }) {
  const email = user ? user.email : "";
  const name = user ? user.name : "";

  const form = useForm<z.infer<typeof orderFormSchema>>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      name: name,
      email: email,
      phone: "",
    },
  });

  const [cart, clearCart] = useCartStore((state) => [
    state.cart,
    state.clearCart,
  ]);

  const [finalPrice, setFinalPrice] = useState(0);

  const [globalDiscount, setGlobalDiscount] = useState<number | undefined>(
    undefined
  );
  const [itemDiscount, setItemDiscount] = useState<
    { id: number; discount: number } | undefined
  >(undefined);
  const [toggleOn, setToggleOn] = useState(false);
  const [tooltipOn, setToolTipOn] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponError, setCouponError] = useState<any>(null);
  const [copuonUsed, setCouponUsed] = useState<boolean>(false);

  useEffect(() => {
    const totalPrice = cart.reduce(
      (accumulator, currentItem) =>
        itemDiscount
          ? currentItem.item.itemId === itemDiscount.id
            ? accumulator +
              currentItem.price *
                (1 - itemDiscount.discount / 100) *
                currentItem.quantity
            : accumulator + currentItem.price * currentItem.quantity
          : accumulator + currentItem.price * currentItem.quantity,
      0
    );
    if (!toggleOn) {
      if (!globalDiscount) {
        setFinalPrice(totalPrice);
      } else {
        setFinalPrice(totalPrice * (1 - globalDiscount / 100));
      }
    } else {
      const packagePrice = cart.reduce((accumulator, item) => {
        if (item.item.itemCategory === "Pizza") {
          return accumulator + 50 * item.quantity;
        } else {
          return accumulator;
        }
      }, 0);

      if (!globalDiscount) {
        setFinalPrice(totalPrice + packagePrice);
      } else {
        setFinalPrice((totalPrice + packagePrice) * (1 - globalDiscount / 100));
      }
    }
  }, [toggleOn, cart, itemDiscount, globalDiscount]);

  async function onSubmit(values: z.infer<typeof orderFormSchema>) {
    const newOrder: OrderType = {
      userId: user ? user.id : null,
      email: user ? user.email : values.email,
      name: user ? user.name : values.name,
      phone: values.phone,
      total: finalPrice,
      status: "pending",
      items: cart,
      takeaway: toggleOn,
      usedCoupon: itemDiscount || globalDiscount ? coupon : null,
    };

    const order = await createOrder(newOrder);

    if (order?.error) {
      toast.warning(order.error);
    } else {
      clearCart();
    }
  }

  async function handleValidateCoupon() {
    setGlobalDiscount(undefined);
    setItemDiscount(undefined);

    await validateCoupon(coupon)
      .then((data) => {
        if (data.error) {
          setCouponUsed(false);
          setCouponError(data.error);
          return;
        }
        if (data.data) {
          setCouponError(undefined);
          setCouponUsed(true);
          if (data.data.itemId) {
            setItemDiscount({
              id: data.data.itemId,
              discount: data.data.discount,
            });
          }
          if (data.data.userId && !data.data.itemId) {
            setGlobalDiscount(data.data.discount);
          }
        }
      })
      .catch((error) => toast.error(error));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Label htmlFor="kaasa">Kohapeal</Label>
        <Switch
          id="kaasa"
          checked={toggleOn}
          onCheckedChange={(e) => setToggleOn(e)}
        />
        <Label htmlFor="kaasa">Kaasa</Label>
        <TooltipProvider>
          <Tooltip open={tooltipOn} onOpenChange={(e) => setToolTipOn(e)}>
            <TooltipTrigger asChild>
              <Info
                className="hover:cursor-pointer"
                onClick={() => setToolTipOn(!tooltipOn)}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Kaasa ostes lisandub iga pitsa kohta 0.5€ pakenditasu.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nimi*</FormLabel>
                <FormControl>
                  <Input placeholder="Toomas Juurikas" {...field} />
                </FormControl>
                <FormDescription>Sisestage enda nimi.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail*</FormLabel>
                <FormControl>
                  <Input placeholder="toomas.juurikas@gmail.com" {...field} />
                </FormControl>
                <FormDescription>Sisestage enda email.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefoninumber*</FormLabel>
                <FormControl>
                  <Input placeholder="555666727" {...field} />
                </FormControl>
                <FormDescription>
                  Sisestage enda telefoninumber.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          {user && (
            <div>
              <Label htmlFor="kupong">Kupong</Label>
              <div className="flex gap-4">
                <Input
                  id="kupong"
                  className="w-1/12"
                  onChange={(e) => setCoupon(e.target.value)}
                  value={coupon}
                ></Input>
                <Button type="button" onClick={handleValidateCoupon}>
                  Valideeri kupong
                </Button>
              </div>
              {couponError && (
                <div className="my-4 p-3 bg-red-100 text-red-800 rounded">
                  {couponError}
                </div>
              )}
              {copuonUsed && (
                <div className="my-4 p-3 bg-green-100 text-green-800 rounded">
                  Kupong kasutuses
                </div>
              )}
            </div>
          )}

          <h1 className="font-bold text-xl">
            Kokku: {(finalPrice / 100).toFixed(2)}€
          </h1>

          <Button className="w-full md:w-1/6" type="submit">
            Mine maksma
          </Button>
        </form>
      </Form>
    </div>
  );
}
