"use server";

import prisma from "@/lib/db";
import { getUser } from "@/lib/shared/actions/actions";

export async function getLatestOrders(limit: number) {
  const { user } = await getUser();

  if (!user) return { error: "Pole lubatud!" };
  if (!user.emailVerified) return { error: "Pole lubatud!" };
  if (user.role !== "ADMIN") return { error: "Pole lubatud!" };

  try {
    const orders = await prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return { data: orders };
  } catch (error) {
    return { error: error };
  }
}

export async function getOrdersCount() {
  const { user } = await getUser();

  if (!user) return { error: "Pole lubatud!" };
  if (!user.emailVerified) return { error: "Pole lubatud!" };
  if (user.role !== "ADMIN") return { error: "Pole lubatud!" };

  try {
    const orderCount = await prisma.order.count();
    return { data: orderCount };
  } catch (error) {
    return { error: error };
  }
}
export async function getItemsCount() {
  const { user } = await getUser();

  if (!user) return { error: "Pole lubatud!" };
  if (!user.emailVerified) return { error: "Pole lubatud!" };
  if (user.role !== "ADMIN") return { error: "Pole lubatud!" };

  try {
    const orderCount = await prisma.item.count();
    return { data: orderCount };
  } catch (error) {
    return { error: error };
  }
}
export async function getUsersCount() {
  const { user } = await getUser();

  if (!user) return { error: "Pole lubatud!" };
  if (!user.emailVerified) return { error: "Pole lubatud!" };
  if (user.role !== "ADMIN") return { error: "Pole lubatud!" };

  try {
    const orderCount = await prisma.user.count();
    return { data: orderCount };
  } catch (error) {
    return { error: error };
  }
}
