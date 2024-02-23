import RegisterForm from "@/app/(userPages)/(auth)/registreeru/components/RegisterForm";
import React from "react";
import { getUser } from "@/lib/shared/actions/actions";
import { redirect } from "next/navigation";

export default async function page() {
  const { user } = await getUser();

  if (user) redirect("/");

  return (
    <div className="px-3 md:px-24 lg:px-52 py-24">
      <div className="flex justify-center items-center">
        <h1 className="text-5xl font-bold pb-8">Registreeru</h1>
      </div>

      <RegisterForm></RegisterForm>
    </div>
  );
}
