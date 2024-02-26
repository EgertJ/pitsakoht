import React from "react";
import UserForm from "./components/UserForm";
import { getUser } from "@/lib/shared/actions/actions";
import { redirect } from "next/navigation";

export default async function VahetaAndmeidPage() {
  const { user } = await getUser();

  if (!user) redirect("/");
  if (user && !user.emailVerified) redirect("/valideeri");
  return (
    <div className="px-3 md:px-24 lg:px-52 py-24">
      <div className="flex justify-center items-center">
        <h1 className="text-5xl font-bold pb-8">Vaheta kasutaja andmeid</h1>
      </div>
      <UserForm user={user}></UserForm>
    </div>
  );
}
