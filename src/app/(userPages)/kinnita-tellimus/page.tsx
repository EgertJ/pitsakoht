import React from "react";
import Checkout from "@/app/(userPages)/kinnita-tellimus/components/Checkout";
import { getUser } from "@/lib/shared/actions/actions";
import { redirect } from "next/navigation";

export default async function KinnitaTellimusPage() {
  const { user } = await getUser();

  if (user && !user.emailVerified) redirect("/valideeri");
  return (
    <main>
      <Checkout></Checkout>
    </main>
  );
}
