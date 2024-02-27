import { Lucia } from "lucia";
import prisma from "@/lib/db";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Coupon, Role } from "@prisma/client";

const client = prisma;

const adapter = new PrismaAdapter(client.session, client.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      emailVerified: attributes.email_verified,
      email: attributes.email,
      role: attributes.role,
      name: attributes.name,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      email: string;
      role: Role;
      name: string;
      email_verified: boolean;
    };
  }
}
