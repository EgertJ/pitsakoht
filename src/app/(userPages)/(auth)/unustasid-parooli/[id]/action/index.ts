"use server"

import { reset_password_schema } from "@/lib/types"
import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import { z } from "zod"
import prisma from "@/lib/db";
import { isWithinExpirationDate } from "oslo";
import { lucia } from "@/lib/auth";
import { Argon2id } from "oslo/password";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export async function reset_password(verificationtoken: string, reset_password: z.infer<typeof reset_password_schema>){

    const result = reset_password_schema.safeParse(reset_password);

    if (!result.success) return { error: "Tekkis tõrge. Proovige uuesti." };

    const tokenHash = encodeHex(await sha256(new TextEncoder().encode(verificationtoken)))
    const token = await prisma.password_reset_token.findFirst({where: {token_hash: tokenHash}})
    if (token) {
        await prisma.password_reset_token.delete({where: {token_hash: token.token_hash}})
    }

    if (!token || !isWithinExpirationDate(token.expires_at)){
        return {error: "Ei leia linki või link on aegunud."}
    }

    

    await lucia.invalidateUserSessions(token.user_id);

    const hashedPassword = await new Argon2id().hash(result.data.new_password)

    await prisma.user.update({where: {id: token.user_id}, data: {hashed_password: hashedPassword}})

    const session = await lucia.createSession(token.user_id, {});

    const sessionCookie = lucia.createSessionCookie(session.id)

    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

    return redirect("/")
}