import { validateRequest } from "@/lib/getUser";
import ValidationInput from "@/app/(userPages)/(auth)/valideeri/components/ValidationInput";
import { redirect } from "next/navigation";
import React from "react";

export default async function ValideeriPage() {
  const { user } = await validateRequest();

  if (user && user.emailVerified) redirect("/");
  return (
    <div className="px-3 md:px-24 lg:px-52 py-24">
      <div className="flex justify-center items-center">
        <h1 className="text-5xl font-bold pb-8">Valideeri kood</h1>
      </div>

      <ValidationInput user={user}></ValidationInput>
    </div>
  );
}
