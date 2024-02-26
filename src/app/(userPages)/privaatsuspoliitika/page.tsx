import React from "react";
import PrivacyPolicy from "./components/PrivacyPolicy";
import { getUser } from "@/lib/shared/actions/actions";
import { redirect } from "next/navigation";

export default async function PrivaatsuspoliitikaPage() {
  const { user } = await getUser();

  if (user && !user.emailVerified) redirect("/valideeri");

  return (
    <div className="px-3 md:px-24 lg:px-52 py-24">
      <div className="flex justify-center items-center">
        <h1 className="text-5xl font-bold pb-8">Privaatsuspoliitika</h1>
      </div>

      <PrivacyPolicy />
    </div>
  );
}
