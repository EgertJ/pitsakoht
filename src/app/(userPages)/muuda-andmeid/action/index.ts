"use server";
import prisma from "@/lib/db";
import {
  generateEmailVerificationCode,
  getUser,
} from "@/lib/shared/actions/actions";
import { updateSchema } from "@/lib/types";
import { z } from "zod";
import { Argon2id } from "oslo/password";

export async function updateUser(
  updatedItems: Partial<z.infer<typeof updateSchema>>
) {
  const result = updateSchema.safeParse(updatedItems);
  if (!result.success) return { error: "Tekkis tõrge. Proovige uuesti." };
  if (!result.data) return { error: "Tekkis tõrge. Proovige uuesti." };
  const { user } = await getUser();

  if (!user) return { error: "Pole lubatud!" };
  if (user && !user.emailVerified) return { error: "Pole lubatud!" };

  let emailUpdated = false;

  try {
    let hashedPassword = undefined;

    const password = result.data.current_password;

    const dbuser = await prisma.user.findFirst({
      where: { id: user.id },
    });

    if (!dbuser) return { error: "Ei leidnud kasutajat, proovige uuesti!" };

    const validPassword = await new Argon2id().verify(
      dbuser.hashed_password,
      password
    );

    if (!validPassword) {
      return { error: "Vale praegune parool." };
    }

    if (result.data.new_password)
      hashedPassword = await new Argon2id().hash(password);

    const updated = {
      name: result.data.name,
      email: result.data.email,
      password: hashedPassword,
      email_verified: result.data.email ? false : true,
    };

    const updatedUser = await prisma.user.update({
      where: { id: dbuser.id },
      data: updated,
    });

    if (result.data.email) {
      await generateEmailVerificationCode(updatedUser.id, updatedUser.email);
    }

    return { data: updatedUser };
  } catch (error) {
    return { error: error };
  }
}
