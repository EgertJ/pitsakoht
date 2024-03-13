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

const ImageSchema = z.instanceof(FormData).optional().nullable();

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
  discountPrice: z.string().optional().nullable(),
  incredients: z.array(z.string()).optional().nullable(),
  addons: z.array(z.string()).optional().nullable(),
  sizes: z.array(SizeSchema).optional().nullable(),
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

export const UpdateItemSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Nimi peab olema",
    })
    .optional(),
  image: ImageSchema,
  price: z.string().min(1, { message: "Hind peab olema" }).optional(),
  discountPrice: z.string().optional().nullable(),
  incredients: z.array(z.string()).optional().nullable(),
  addons: z.array(z.string()).optional().nullable(),
  sizes: z.array(SizeSchema).optional().nullable(),
  categoryId: z
    .string()
    .min(1, { message: "Kategooria peab olema" })
    .optional(),
  topCategory: z.nativeEnum(TopCategory).optional(),
});

export const UserSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Nimi peab olema",
    })
    .optional(),
  email: z.string().email({ message: "Ei ole õige e-mail" }).optional(),
  email_verified: z.boolean().optional(),
  role: z.nativeEnum(Role).optional(),
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

  export const reset_password_schema = z
  .object({
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
      ),
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
      ),
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
  );

  export const forgotPasswordSchema = z.object({
    email: z.string().email("See ei ole õige e-mail."),
    
  });

export const CouponSchema = z
  .object({
    code: z.string().min(1, { message: "Kood on vajalik" }),
    discount: z.number(),
    itemId: z.number().nullable().optional(),
    userId: z.string().nullable().optional(),
  })
  .transform((data) => ({
    ...data,
    discount:
      typeof data.discount === "string"
        ? parseFloat(data.discount)
        : data.discount,
  }))
  .refine((data) => typeof data.discount == "number" || !isNaN(data.discount), {
    message: "Soodustus peab olema number.",
    path: ["discount"],
  })
  .refine((data) => data.discount >= 0 && data.discount <= 100, {
    message: "Soodustus peab olema protsent (0-100).",
    path: ["discount"],
  })
  .refine((data) => data.userId !== undefined || data.itemId !== undefined, {
    message: "Seotud kasutaja peab olema, kui seotud toodet pole.",
    path: ["userId"],
  })
  .refine((data) => data.itemId !== undefined || data.userId !== undefined, {
    message: "Seotud toode peab olema, kui seotud kasutajat pole.",
    path: ["itemId"],
  });

export const UpdateCouponSchema = z
  .object({
    code: z.string().min(1, { message: "Kood on vajalik" }).optional(),
    discount: z.number().optional(),
    itemId: z.number().nullable().optional(),
    userId: z.string().nullable().optional(),
  })
  .transform((data) => ({
    ...data,
    discount:
      typeof data.discount === "string"
        ? parseFloat(data.discount)
        : data.discount,
  }))
  .refine(
    (data) =>
      typeof data.discount === "undefined" ||
      typeof data.discount == "number" ||
      !isNaN(data.discount),
    {
      message: "Soodustus peab olema number.",
      path: ["discount"],
    }
  );

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
  usedCoupon: string | null;
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
