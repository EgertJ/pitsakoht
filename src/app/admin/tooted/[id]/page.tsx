import React from "react";

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getCategories, getIngredients } from "../action";
import { validateRequest } from "@/lib/getUser";
import { redirect } from "next/navigation";
import { getItem } from "./actions";
import UpdateProduct from "./components/UpdateProduct";

export default async function LisaToodePage({
  params,
}: {
  params: { id: string };
}) {
  const { user } = await validateRequest();

  if (!user) redirect("/");
  if (!user.emailVerified) redirect("/");
  if (user.role !== "ADMIN") redirect("/");
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["ingredients"],
    queryFn: () => getIngredients(),
  });
  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  await queryClient.prefetchQuery({
    queryKey: ["item"],
    queryFn: () => getItem(params.id),
  });
  return (
    <div>
      <h1 className="font-bold text-xl pb-20">Uuenda toode</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <UpdateProduct params={params}></UpdateProduct>
      </HydrationBoundary>
    </div>
  );
}
