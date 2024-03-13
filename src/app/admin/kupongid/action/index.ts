"use server";

import { validateRequest } from "@/lib/getUser";
import prisma from "@/lib/db";
import { z } from "zod";
import { CouponSchema, UpdateCouponSchema } from "@/lib/types";
export async function getCoupons() {
  const { user } = await validateRequest();

  if (!user) return { error: "Pole lubatud!" };
  if (!user.emailVerified) return { error: "Pole lubatud!" };
  if (user.role !== "ADMIN") return { error: "Pole lubatud!" };

  try {
    const coupons = await prisma.coupon.findMany();

    return { data: coupons };
  } catch (error) {
    return { error: error };
  }
}

export async function getItems() {
  try {
    const items = await prisma.item.findMany();

    return { data: items };
  } catch (error) {
    return { error: error };
  }
}

export async function createCoupon(values: z.infer<typeof CouponSchema>) {
  const { user } = await validateRequest();
  const result = CouponSchema.safeParse(values);

  if (!result.success) return { error: "Tekkis tõrge. Proovige uuesti." };

  if (!user) return { error: "Pole lubatud!" };
  if (!user.emailVerified) return { error: "Pole lubatud!" };
  if (user.role !== "ADMIN") return { error: "Pole lubatud!" };

  try {
    const createdCoupon = await prisma.coupon.create({
      data: {
        code: values.code,
        discount: values.discount,
        userId: values.userId,
        itemId: values.itemId,
      },
    });

    return { data: createdCoupon };
  } catch (error) {
    return { error: error };
  }
}

export async function updateCoupon(
  id: number,
  updatedData: Partial<z.infer<typeof UpdateCouponSchema>>
) {
  const result = UpdateCouponSchema.safeParse(updatedData);

  if (!result.success) return { error: "Tekkis tõrge. Proovige uuesti." };
  const { user } = await validateRequest();
  if (!user) return { error: "Pole lubatud!" };
  if (!user.emailVerified) return { error: "Pole lubatud!" };
  if (user.role !== "ADMIN") return { error: "Pole lubatud!" };

  try {
    const updatedItem = await prisma.coupon.update({
      where: { id: id },
      data: updatedData,
    });

    return { data: updatedItem };
  } catch (error) {
    return { error: error };
  }
}

export async function deleteCoupon(id: number) {
  const { user } = await validateRequest();
  if (!user) return { error: "Pole lubatud!" };
  if (!user.emailVerified) return { error: "Pole lubatud!" };
  if (user.role !== "ADMIN") return { error: "Pole lubatud!" };

  try {
    const deletedItem = await prisma.coupon.delete({ where: { id: id } });

    return { data: deletedItem };
  } catch (error) {
    return { error: error };
  }
}
