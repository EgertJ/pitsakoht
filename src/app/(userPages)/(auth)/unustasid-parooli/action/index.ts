"use server"
import prisma from "@/lib/db";
import { generateId } from "lucia";
import { TimeSpan, createDate} from "oslo";
import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import nodemailer from "nodemailer";
import { z } from "zod";
import { forgotPasswordSchema } from "@/lib/types";

//Creates password reset token
async function createPasswordResetToken(userId: string): Promise<string> {
  await prisma.password_reset_token.deleteMany({where: {user_id: userId}})
	const tokenId = generateId(40);
	const tokenHash = encodeHex(await sha256(new TextEncoder().encode(tokenId)));
  await prisma.password_reset_token.create({
    data: {
      token_hash: tokenHash,
      user_id: userId,
      expires_at: createDate(new TimeSpan(2, "h"))
    }
  })
	return tokenId;
}

const email = process.env.EMAIL;
const password = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    user: email,
    pass: password,
  },
});

export async function sendPasswordResetToken(
  sendEmail: string,
  verificationCode: string
) {
  try {
    const mailOptions: Object = {
      from: email,
      to: sendEmail,
      subject: "Pitsakoht unustasid parooli",
      text: verificationCode,
    };

    await transporter.sendMail(mailOptions);

    return { message: "Meil saadetud" };
  } catch (e) {
    console.error(e);
    return { error: e };
  }
}



export async function reset_password(data: z.infer<typeof forgotPasswordSchema>){

  const result = forgotPasswordSchema.safeParse(data);

  if (!result.success) return { error: "Tekkis tõrge. Proovige uuesti." };


    const user = await prisma.user.findFirst({where: {email: data.email}})
    if (!user || !user.email_verified) {
		return {error: "Vale email!"}
	}

    const verificationToken = await createPasswordResetToken(user.id);
    const verificationLink = "http://localhost:3000/unustasid-parooli/" + verificationToken;

    await sendPasswordResetToken(data.email, verificationLink);


    return {status: "Success"}
}