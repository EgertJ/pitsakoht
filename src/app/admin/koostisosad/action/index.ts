"use server";
import prisma from "@/lib/db";
import { getUser } from "@/lib/shared/actions/actions";
import { IngredientSchema } from "@/lib/types";
import { z } from "zod";

export async function deleteIngredient(id: number) {
  const { user } = await getUser();

  if (!user) return { error: "Pole lubatud!" };
  if (!user.emailVerified) return { error: "Pole lubatud!" };
  if (user.role !== "ADMIN") return { error: "Pole lubatud!" };

  try {
    const deletedItem = prisma.ingredient.delete({ where: { id } });

    return { data: deletedItem };
  } catch (error) {
    return { error: error };
  }
}

export async function addIngredient(values: z.infer<typeof IngredientSchema>) {
  const { user } = await getUser();

  if (!user) return { error: "Pole lubatud!" };
  if (!user.emailVerified) return { error: "Pole lubatud!" };
  if (user.role !== "ADMIN") return { error: "Pole lubatud" };

  const result = IngredientSchema.safeParse(values);

  if (!result.success) return { error: "Tekkis tõrge. Proovige uuesti." };

  try {
    const addedItem = prisma.ingredient.create({
      data: {
        name: result.data.name,
        category: result.data.category,
        price: result.data.price,
      },
    });

    return { data: addedItem };
  } catch (error) {
    return { error: error };
  }
}

export async function updateIngredient(
  id: number,
  updatedData: Partial<z.infer<typeof IngredientSchema>>
) {
  try {
    const updatedItem = await prisma.ingredient.update({
      where: { id: id },
      data: updatedData,
    });

    return { data: updatedItem };
  } catch (error) {
    return { error: error };
  }
}
