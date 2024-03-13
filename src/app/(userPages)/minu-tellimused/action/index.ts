"use server";

import { validateRequest } from "@/lib/getUser";
import prisma from "@/lib/db";

export async function getUserOrders() {
  const { user } = await validateRequest();

  if (!user) return { error: "Ei ole lubatud!" };

  if (!user.emailVerified) return { error: "Ei ole lubatud!" };

  try {
    const userOrders = await prisma.order.findMany({
      where: { userId: user.id },
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

    return { data: userOrders };
  } catch (error) {
    return { error: error };
  }
}
