import React from "react";
import Orders from "./components/Orders";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/getUser";
import { getNotDeliveredOrders } from "./action";

export default async function KöökPage() {
  const { user } = await validateRequest();

  if (!user || !user.emailVerified || user.role !== "ADMIN") redirect("/");

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["orders"],
    queryFn: () => getNotDeliveredOrders(),
  });

  return (
    <div className="bg-black">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Orders></Orders>
      </HydrationBoundary>
    </div>
  );
}
