import { getUser } from "@/lib/shared/actions/actions";
import { redirect } from "next/navigation";
import React from "react";

export default async function KoostiosadPage() {
  const { user } = await getUser();

  if (!user) redirect("/");
  if (!user.emailVerified) redirect("/");
  if (user.role !== "ADMIN") redirect("/");
  return <div>page</div>;
}
