"use server";

import prisma from "@/lib/db";
import { getUser } from "@/lib/shared/actions/actions";
import { OrderStatus } from "@prisma/client";

export async function getOrders() {
  const { user } = await getUser();

  if (!user) return { error: "Pole lubatud!" };
  if (!user.emailVerified) return { error: "Pole lubatud!" };
  if (user.role !== "ADMIN") return { error: "Pole lubatud!" };

  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            item: true,
            addons: {
              include: {
                itemAddon: { include: { ingredient: true } },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return { data: orders };
  } catch (error) {
    return { error: error };
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const { user } = await getUser();

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
