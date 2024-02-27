"use server";

import prisma from "@/lib/db";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { TimeSpan, createDate, isWithinExpirationDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";
import { cache } from "react";
import { ActionResult } from "next/dist/server/app-render/types";

import type { Session, User } from "lucia";

import { loginSchema, registerSchema, codeSchema } from "@/lib/types";

export const getUser = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId)
      return {
        user: null,
        session: null,
      };
    const result = await lucia.validateSession(sessionId);
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {}
    return result;
  }
);

export async function signup({
  data,
}: {
  data: z.infer<typeof registerSchema>;
}) {
  const result = registerSchema.safeParse(data);
  if (!result.success) return { error: "Tekkis tõrge. Proovige uuesti." };

  const email = result.data.email;
  const password = result.data.password;
  const name = result.data.name;

  const hashedPassword = await new Argon2id().hash(password);
  const userId = generateId(15);

  try {
    await prisma.user.create({
      data: {
        id: userId,
        email: email,
        hashed_password: hashedPassword,
        name: name,
        email_verified: false,
      },
    });

    const verificationCode = await generateEmailVerificationCode(userId, email);

    console.log(verificationCode);

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { error: "Sellise e-mailiga kasutaja juba eksisteerib!" };
    }
    return { error: "Tekkis tõrge. Proovige uuesti." };
  }

  return redirect("/valideeri");
}

export async function signin({ data }: { data: z.infer<typeof loginSchema> }) {
  const result = loginSchema.safeParse(data);
  if (!result.success) return { error: "Tekkis tõrge. Proovige uuesti." };

  const email = result.data.email;
  const password = result.data.password;

  const user = await prisma.user.findFirst({
    where: { email: email },
  });

  if (!user) {
    return { error: "Vale e-mail või parool." };
  }

  const validPassword = await new Argon2id().verify(
    user.hashed_password,
    password
  );

  if (!validPassword) {
    return { error: "Vale e-mail või parool." };
  }

  const session = await lucia.createSession(user.id, {});

  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return redirect("/");
}

export async function logout(): Promise<ActionResult> {
  const { session } = await getUser();

  if (!session) {
    return {
      error: "Ei ole lubatud!",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/");
}

export async function generateEmailVerificationCode(
  userId: string,
  email: string
): Promise<string> {
  await prisma.email_verification_code.deleteMany({
    where: { user_id: userId },
  });
  const code = generateRandomString(8, alphabet("0-9"));

  await prisma.email_verification_code.create({
    data: {
      user_id: userId,
      email,
      code,
      expires_at: createDate(new TimeSpan(5, "m")),
    },
  });
  return code;
}

export async function verifyEmailToken({
  data,
}: {
  data: z.infer<typeof codeSchema>;
}) {
  const user = await getUser();
  if (!user) {
    return { error: "Ei leia sessiooni." };
  }

  const result = codeSchema.safeParse(data);
  if (!result.success) return { error: "Vale kood!" };

  const databaseCode = await prisma.email_verification_code.findFirst({
    where: { user_id: user.user?.id },
  });

  if (databaseCode) {
    await prisma.email_verification_code.delete({
      where: { id: databaseCode.id },
    });
  }

  if (!databaseCode || databaseCode.code !== data.code) {
    return { error: "Vale kood või koodi ei eksisteeri!" };
  }
  if (!isWithinExpirationDate(databaseCode.expires_at)) {
    return { error: "Kood on aegunud!" };
  }
  if (!user || user.user?.email !== databaseCode.email) {
    return { error: "Tekkis tõrge! Proovige uuesti!" };
  }

  await lucia.invalidateUserSessions(user.user?.id);
  await prisma.user.update({
    where: { id: user.user?.id },
    data: {
      email_verified: true,
    },
  });

  const session = await lucia.createSession(user.user?.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return redirect("/");
}

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