import { ItemParams } from "@/components/ui/ItemCard";
import { Ingredient, OrderStatus, Size, Sizes } from "@prisma/client";
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, {
    message: "Nimi on vajalik.",
  }),
  email: z.string().email("See ei ole õige e-mail."),
  password: z
    .string()
    .min(8, {
      message: "Parool peab olema vähemalt 8 tähemärki.",
    })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/, {
      message: "Parool peab sisaldama vähemalt ühte tähte ja ühte numbrit.",
    }),
});

export const loginSchema = z.object({
  email: z.string().email("See ei ole õige e-mail."),
  password: z
    .string()
    .min(8, {
      message: "Parool peab olema vähemalt 8 tähemärki.",
    })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/, {
      message: "Parool peab sisaldama vähemalt ühte tähte ja ühte numbrit.",
    }),
});

export const codeSchema = z.object({
  code: z.string().min(8, {
    message: "Kood on vähemalt 8 tähte",
  }),
});

export type AddonType = {
  addonId: number;
  addonName: string;
  addonPrice: number;
  addonCount: number;
};

export type CartItem = {
  id: number;
  item: ItemParams;
  price: number;
  quantity: number;
  size:
    | {
        size: Sizes;
        price: number;
      }
    | undefined;
  addons: AddonType[];
};

export type OrderType = {
  userId: string | null;
  email: string | null;
  name: string | null;
  phone: string | null;
  total: number;
  status: OrderStatus;
  items: CartItem[];
};
