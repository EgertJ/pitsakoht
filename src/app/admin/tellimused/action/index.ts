"use server";
import prisma from "@/lib/db";
import { validateRequest } from "@/lib/getUser";

export async function deleteOrder(id: string) {
  const { user } = await validateRequest();

  if (!user) return { error: "Pole lubatud!" };
  if (!user.emailVerified) return { error: "Pole lubatud!" };
  if (user.role !== "ADMIN") return { error: "Pole lubatud!" };

  try {
    const deletedItem = await prisma.order.delete({ where: { id: id } });

    return { data: deletedItem };
  } catch (error) {
    return { error: error };
  }
}
