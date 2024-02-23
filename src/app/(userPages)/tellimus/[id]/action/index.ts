"use server";

import prisma from "@/lib/db";

export async function getOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
      include: {
        items: {
          include: {
            addons: {
              include: {
                itemAddon: {
                  include: {
                    ingredient: true,
                  },
                },
              },
            },
            item: true,
          },
        },
      },
    });
    return { data: order };
  } catch (error) {
    return { error: "Ostu leidmisel tekkis viga. Proovige uuesti." };
  }
}
