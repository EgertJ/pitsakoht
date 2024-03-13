import { validateRequest } from "@/lib/getUser";
import { redirect } from "next/navigation";
import React from "react";
import InfoCard from "./components/InfoCard";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  getItemsCount,
  getLatestOrders,
  getOrdersCount,
  getUsersCount,
} from "./action";
import LatestOrders from "./components/LatestOrders";

export default async function AdminPage() {
  const { user } = await validateRequest();

  if (!user || !user.emailVerified || user.role !== "ADMIN") redirect("/");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["latestPurchases"],
    queryFn: () => getLatestOrders(10),
  });

  await queryClient.prefetchQuery({
    queryKey: ["ordersCount"],
    queryFn: () => getOrdersCount(),
  });

  await queryClient.prefetchQuery({
    queryKey: ["usersCount"],
    queryFn: () => getUsersCount(),
  });

  await queryClient.prefetchQuery({
    queryKey: ["itemsCount"],
    queryFn: () => getItemsCount(),
  });

  return (
    <div>
      <h1 className="pb-36 font-bold text-xl ">Pealeht</h1>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="grid grid-cols-3 ">
          <InfoCard
            title="Kasutajat kokku"
            queryFn={getUsersCount}
            queryKey="usersCount"
          ></InfoCard>
          <InfoCard
            title="Ostu kokku"
            queryFn={getOrdersCount}
            queryKey="ordersCount"
          ></InfoCard>
          <InfoCard
            title="Toodet kokku"
            queryFn={getItemsCount}
            queryKey="itemsCount"
          ></InfoCard>
        </div>
        <div className="">
          <h1 className="text-xl pb-8">Viimased ostud</h1>
          <LatestOrders></LatestOrders>
        </div>
      </HydrationBoundary>
    </div>
  );
}
