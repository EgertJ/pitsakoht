"use server";
import prisma from "@/lib/db";
import { lucia } from "@/lib/auth";
import { getUser } from "@/lib/shared/actions/actions";
import { z } from "zod";
import { UserSchema } from "@/lib/types";

export async function getUsers() {
  const { user } = await getUser();

  if (!user) return { error: "Pole lubatud!" };
  if (!user.emailVerified) return { error: "Pole lubatud!" };
  if (user.role !== "ADMIN") return { error: "Pole lubatud!" };

  try {
    const users = await prisma.user.findMany();

    return { data: users };
  } catch (error) {
    return { error: error };
  }
}

export async function updateUser(
  id: string,
  updatedData: Partial<z.infer<typeof UserSchema>>
) {
  const result = UserSchema.safeParse(updatedData);

  if (!result.success) return { error: "Tekkis tõrge. Proovige uuesti." };

  try {
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: result.data,
    });

    return { data: updatedUser };
  } catch (error) {
    return { error: error };
  }
}

export async function deleteUser(id: string) {
  const { user } = await getUser();

  if (!user) return { error: "Pole lubatud!" };
  if (!user.emailVerified) return { error: "Pole lubatud!" };
  if (user.role !== "ADMIN") return { error: "Pole lubatud!" };

  try {
    await lucia.invalidateUserSessions(id);
    const deletedUser = await prisma.user.delete({ where: { id: id } });
    return { data: deletedUser };
  } catch (error) {
    return { error: error };
  }
}
