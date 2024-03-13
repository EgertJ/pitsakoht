"use server";

import prisma from "@/lib/db";
import { validateRequest } from "@/lib/getUser";
import { OrderStatus } from "@prisma/client";

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const { user } = await validateRequest();

  if (!user) return { error: "Pole lubatud!" };
  if (!user.emailVerified) return { error: "Pole lubatud!" };
  if (user.role !== "ADMIN") return { error: "Pole lubatud!" };

  try {
    const updatedOrder = await prisma.order.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });

    return { data: updatedOrder };
  } catch (error) {
    return { error: error };
  }
}
