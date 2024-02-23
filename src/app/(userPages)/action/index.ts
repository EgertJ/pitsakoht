"use server";

import prisma from "@/lib/db";
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        items: {
          include: {
            sizes: true,
            incredients: {
              include: {
                ingredient: true,
              },
            },
            addons: {
              include: {
                ingredient: true,
              },
            },
          },
        },
      },
    });
    return { categories };
  } catch (error) {
    return { error: error };
  }
}
