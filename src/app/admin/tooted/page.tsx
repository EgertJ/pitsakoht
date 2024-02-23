import { getUser } from "@/lib/shared/actions/actions";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import React from "react";
import { getItems } from "./action";
import ItemsTable from "./components/ItemsTable";

export default async function TootedPage() {
  const { user } = await getUser();

  if (!user) redirect("/");
  if (!user.emailVerified) redirect("/");
  if (user.role !== "ADMIN") redirect("/");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["items"],
    queryFn: () => getItems(),
  });

  return (
    <div>
      <h1 className="font-bold text-xl pb-40">Tooted</h1>
      <ItemsTable></ItemsTable>
    </div>
  );
}
