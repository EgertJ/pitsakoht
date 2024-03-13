import React from "react";
import Contact from "@/app/(userPages)/kontakt/components/Contact";
import { validateRequest } from "@/lib/getUser";
import { redirect } from "next/navigation";

export default async function KontaktPage() {
  const { user } = await validateRequest();

  if (user && !user.emailVerified) redirect("/valideeri");
  return (
    <main>
      <Contact></Contact>
    </main>
  );
}
