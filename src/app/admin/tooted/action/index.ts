"use server";
import prisma from "@/lib/db";
import { validateRequest } from "@/lib/getUser";
import fs from "fs/promises";
import path from "path";
export async function getItems() {
  try {
    const items = await prisma.item.findMany({
      include: {
        sizes: true,
        incredients: { include: { ingredient: true } },
        addons: { include: { ingredient: true } },
        category: true,
      },
    });

    return { data: items };
  } catch (error) {
    return { error: error };
  }
}

export async function deleteItem(id: number) {
  const { user } = await validateRequest();

  if (!user || !user.emailVerified || user.role !== "ADMIN") return { error: "Pole lubatud!" };

  try {
    const deletedItem = await prisma.item.delete({ where: { id: id } });
    if (deletedItem.image)
      await fs.unlink(path.join(process.cwd(), "/public", deletedItem.image));
    return { data: deletedItem };
  } catch (error) {
    return { error: error };
  }
}

export async function getIngredients() {
  try {
    const ingredients = await prisma.ingredient.findMany();

    return { data: ingredients };
  } catch (error) {
    return { error: error };
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany();

    return { data: categories };
  } catch (error) {
    return { error: error };
  }
}
