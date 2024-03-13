import { getOrders } from "@/lib/shared/actions/actions";
import { validateRequest } from "@/lib/getUser";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import React from "react";
import OrdersTable from "./components/OrdersTable";

export default async function page() {
  const { user } = await validateRequest();

  if (!user || !user.emailVerified || user.role !== "ADMIN") redirect("/");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });
  return (
    <div>
      <h1 className="font-bold text-xl pb-40">Tellimused</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <OrdersTable />
      </HydrationBoundary>
    </div>
  );
}
