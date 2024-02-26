import React from "react";
import Orders from "./components/Orders";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getOrders, getUser } from "@/lib/shared/actions/actions";
import { redirect } from "next/navigation";

export default async function KöökPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
  });

  const { user } = await getUser();

  if (!user) redirect("/");
  if (!user.emailVerified) redirect("/");
  if (user.role !== "ADMIN") redirect("/");

  return (
    <div className="bg-black">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Orders></Orders>
      </HydrationBoundary>
    </div>
  );
}
