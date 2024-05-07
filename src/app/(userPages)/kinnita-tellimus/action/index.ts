"use server";

import prisma from "@/lib/db";
import { validateRequest } from "@/lib/getUser";
import { OrderType } from "@/lib/types";
import { redirect } from "next/navigation";

export async function createOrder(order: OrderType) {
  if (!order.userId && order.usedCoupon) {
    return { error: "Ainult kasutaja saab kasutada kupongi!" };
  }

  if (!order.email && !order.name && !order.phone) {
    return { error: "Viga tellija leidmisest, palun proovige uuesti." };
  }

  if (order.items.length === 0) {
    return { error: "Tellimus ei saa olla tühi." };
  }
  let orderId = null;

  try {
    const newOrder = await prisma.order.create({
      data: {
        id: crypto.randomUUID(),
        userId: order.userId,
        email: order.email,
        name: order.name,
        phone: order.phone,
        total: order.total,
        takeaway: order.takeaway,
        status: order.status,
        usedCouponCode: order.usedCoupon,
        items: {
          create: order.items.map((item) => ({
            itemId: item.item.itemId,
            size: item.size?.size,
            quantity: item.quantity,
            addons: {
              create: item.addons.map((addon) => ({
                itemId: addon.addonId,
                ingredientId: addon.ingredientId,
                quantity: addon.addonCount,
              })),
            },
          })),
        },
      },
    });
    if (order.usedCoupon && order.userId) {
      await prisma.coupon.update({
        where: { code: order.usedCoupon },
        data: {
          usedBy: {
            connect: [{ id: order.userId }],
          },
        },
      });
    }
    orderId = newOrder.id;
  } catch (error) {
    return { error: "Ostu sooritamisel tekkis viga. Proovige uuesti." };
  }

  if (!orderId)
    return { error: "Ostu sooritamisel tekkis viga. Proovige uuesti." };
  return redirect(`/tellimus/${orderId}`);
}

export async function validateCoupon(code: string) {
  const { user } = await validateRequest();
  if (!user) return { error: "Pole lubatud!" };
  if (!user.emailVerified) return { error: "Pole lubatud!" };
  try {
    const coupon = await prisma.coupon.findFirst({ where: { code: code } });

    const userCoupons = await prisma.user.findFirst({
      where: { id: user.id },
      select: { usedCoupons: { select: { code: true } } },
    });

    const isCouponUsed = userCoupons?.usedCoupons.some(
      (usedCoupon) => usedCoupon.code === code
    );
    if (isCouponUsed) return { error: "Kupong on juba kasutatud!" };

    if (!coupon) return { error: "Kupongi ei leitud!" };

    if (coupon.userId) {
      if (coupon.userId !== user.id) return { error: "Kupongi ei leitud!" };
    }

    return { data: coupon };
  } catch (error) {
    return { error: error };
  }
}
