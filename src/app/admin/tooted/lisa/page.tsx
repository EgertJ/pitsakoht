import React from "react";
import ItemForm from "../components/ItemForm";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getCategories, getIngredients } from "../action";
import { validateRequest } from "@/lib/getUser";
import { redirect } from "next/navigation";

export default async function LisaToodePage() {
  const { user } = await validateRequest();

  if (!user || !user.emailVerified || user.role !== "ADMIN") redirect("/");
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["ingredients"],
    queryFn: () => getIngredients(),
  });
  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
  return (
    <div>
      <h1 className="font-bold text-xl pb-20">Lisa toode</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ItemForm
          initialValues={undefined}
          id={undefined}
          oldImage={null}
        ></ItemForm>
      </HydrationBoundary>
    </div>
  );
}
