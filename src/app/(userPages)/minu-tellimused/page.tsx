import { getUser } from "@/lib/shared/actions/actions";
import { redirect } from "next/navigation";
import React from "react";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getUserOrders } from "./action";
import UserOrdersTable from "./components/UserOrdersTable";

export default async function MinuTellimusedPage() {
  const { user } = await getUser();
  if (!user) redirect("/");
  if (!user.emailVerified) redirect("/valideeri");

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["userOrders"],
    queryFn: () => getUserOrders(),
  });

  return (
    <div className="px-3 md:px-24 lg:px-52 py-24">
      <div className="flex justify-center items-center">
        <h1 className="text-5xl font-bold pb-8">Vaata enda tellimusi</h1>
      </div>
      <UserOrdersTable></UserOrdersTable>
    </div>
  );
}
