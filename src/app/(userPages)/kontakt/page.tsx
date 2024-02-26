import React from "react";
import Contact from "@/app/(userPages)/kontakt/components/Contact";
import { getUser } from "@/lib/shared/actions/actions";
import { redirect } from "next/navigation";

export default async function KontaktPage() {
  const { user } = await getUser();

  if (user && !user.emailVerified) redirect("/valideeri");
  return (
    <main>
      <Contact></Contact>
    </main>
  );
}
