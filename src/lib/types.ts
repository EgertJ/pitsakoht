import { ItemParams } from "@/app/(userPages)/components/ItemCard";
import {
  Ingredient,
  IngredientCategory,
  OrderStatus,
  Prisma,
  Size,
  Sizes,
} from "@prisma/client";
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
  ingredientId: number;
  addonName: string;
  addonPrice: number;
  addonCount: number;
  addonCategory: IngredientCategory;
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
  takeaway: boolean;
};

export type OrderWithItemsAndAddons = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        item: true;
        addons: {
          include: {
            itemAddon: { include: { ingredient: true } };
          };
        };
      };
    };
  };
}>;

export type ItemWithSizesIngredientsAndAddons = Prisma.ItemGetPayload<{
  include: {
    sizes: true;
    incredients: { include: { ingredient: true } };
    addons: { include: { ingredient: true } };
    category: true;
  };
}>;
