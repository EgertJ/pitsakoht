import { validateRequest } from "@/lib/getUser";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import React from "react";
import { getUsers } from "./action";
import UsersTable from "./components/UsersTable";

export default async function KasutajadPage() {
  const { user } = await validateRequest();
  
  if (!user || !user.emailVerified || user.role !== "ADMIN") redirect("/");

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });

  return (
    <div>
      <h1 className="font-bold text-xl pb-40">Kasutajad</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UsersTable></UsersTable>
      </HydrationBoundary>
    </div>
  );
}
