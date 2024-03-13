import React from "react";
import Checkout from "@/app/(userPages)/kinnita-tellimus/components/Checkout";
import { validateRequest } from "@/lib/getUser";
import { redirect } from "next/navigation";

export default async function KinnitaTellimusPage() {
  const { user } = await validateRequest();

  if (user && !user.emailVerified) redirect("/valideeri");
  return (
    <main>
      <Checkout></Checkout>
    </main>
  );
}
