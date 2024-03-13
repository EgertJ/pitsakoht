import React from "react";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/getUser";
import { getCoupons, getItems } from "./action";
import CouponTable from "./components/CouponTable";
import { getUsers } from "../kasutajad/action";
export default async function KupongidPage() {
  const { user } = await validateRequest();

  if (!user || !user.emailVerified || user.role !== "ADMIN") redirect("/");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["coupons"],
    queryFn: () => getCoupons(),
  });

  await queryClient.prefetchQuery({
    queryKey: ["items"],
    queryFn: () => getItems(),
  });

  await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  return (
    <div>
      <h1 className="font-bold text-xl pb-40">Kupongid</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CouponTable />
      </HydrationBoundary>
    </div>
  );
}
