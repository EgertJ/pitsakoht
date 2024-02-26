import { getUser } from "@/lib/shared/actions/actions";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import React from "react";
import { getIngredients } from "../tooted/action";
import IngredientTable from "./components/IngredientTable";

export default async function KoostiosadPage() {
  const { user } = await getUser();

  if (!user) redirect("/");
  if (!user.emailVerified) redirect("/");
  if (user.role !== "ADMIN") redirect("/");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["ingredients"],
    queryFn: () => getIngredients(),
  });

  return (
    <div>
      <h1 className="font-bold text-xl pb-40">Koostiosad</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <IngredientTable></IngredientTable>
      </HydrationBoundary>
    </div>
  );
}
