import React from "react";
import AddProduct from "./components/AddProduct";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getCategories, getIngredients } from "../action";

export default async function LisaToodePage() {
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
        <AddProduct></AddProduct>
      </HydrationBoundary>
    </div>
  );
}
