import LoginForm from "@/app/(userPages)/(auth)/logi-sisse/components/LoginForm";
import React from "react";
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/getUser";

export default async function LogiSissePage() {
  const { user } = await validateRequest();

  if (user) redirect("/");

  return (
    <div className="px-3 md:px-24 lg:px-52 py-24">
      <div className="flex justify-center items-center">
        <h1 className="text-5xl font-bold pb-8">Logi sisse</h1>
      </div>
      <LoginForm></LoginForm>
    </div>
  );
}
