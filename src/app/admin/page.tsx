import { validateRequest } from "@/lib/getUser";
import { redirect } from "next/navigation";
import React from "react";

export default async function AdminPage() {
  const { user } = await validateRequest();

  if (!user || !user.emailVerified || user.role !== "ADMIN") redirect("/");

  return (
    <div>
      <h1 className="pb-36 font-bold text-xl ">Pealeht</h1>
    </div>
  );
}
