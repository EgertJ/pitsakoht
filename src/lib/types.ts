import { ItemParams } from "@/app/(userPages)/components/ItemCard";
import {
  Ingredient,
  IngredientCategory,
  OrderStatus,
  Prisma,
  Role,
  Size,
  Sizes,
  TopCategory,
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

const ImageSchema = z.instanceof(FormData).optional();

const SizeSchema = z.object({
  name: z.nativeEnum(Sizes),
  price: z.string().min(1, { message: "Hind peab olema" }),
});

export const ItemSchema = z.object({
  name: z.string().min(1, {
    message: "Nimi peab olema",
  }),
  image: ImageSchema,
  price: z.string().min(1, { message: "Hind peab olema" }),
  discountPrice: z.string().optional(),
  incredients: z.array(z.string()).optional(),
  addons: z.array(z.string()).optional(),
  sizes: z.array(SizeSchema).optional(),
  categoryId: z.string().min(1, { message: "Kategooria peab olema" }),
  topCategory: z.nativeEnum(TopCategory),
});
export const IngredientSchema = z.object({
  name: z.string().min(1, {
    message: "Nimi peab olema",
  }),
  price: z.number(),
  category: z.nativeEnum(IngredientCategory),
});

export const UserSchema = z.object({
  name: z.string().min(1, {
    message: "Nimi peab olema",
  }),
  email: z.string().email({ message: "Ei ole õige e-mail" }),
  email_verified: z.boolean(),
  role: z.nativeEnum(Role),
});

export const updateSchema = z
  .object({
    name: z
      .string()
      .min(1, {
        message: "Nimi on vajalik.",
      })
      .optional(),
    email: z.string().email("See ei ole õige e-mail.").optional(),
    current_password: z
      .string()
      .min(8, {
        message: "Parool peab olema vähemalt 8 tähemärki.",
      })
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/, {
        message: "Parool peab sisaldama vähemalt ühte tähte ja ühte numbrit.",
      }),
    new_password: z
      .string()
      .refine(
        (value) =>
          value === "" ||
          (value.length >= 8 &&
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/.test(value)),
        {
          message:
            "Parool peab olema vähemalt 8 tähemärki ja sisaldama vähemalt ühte tähte ja ühte numbrit, või olema tühi.",
        }
      )
      .optional(),
    new_password_validate: z
      .string()
      .refine(
        (value) =>
          value === "" ||
          (value.length >= 8 &&
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/.test(value)),
        {
          message:
            "Parool peab olema vähemalt 8 tähemärki ja sisaldama vähemalt ühte tähte ja ühte numbrit, või olema tühi.",
        }
      )
      .optional(),
  })
  .refine(
    (data) => {
      if (data.new_password !== undefined) {
        return data.new_password === data.new_password_validate;
      }
      return true;
    },
    {
      message: "Uus parool ei kattu.",
      path: ["new_password_validate"],
    }
  )
  .optional();

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
