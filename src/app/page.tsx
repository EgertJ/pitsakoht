import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getCategories } from "@/app/actions";
import ShoppingCartButton from "@/components/ShoppingCartButton";

export default async function Home() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Hero />
        <Menu />
        <ShoppingCartButton />
      </HydrationBoundary>
    </main>
  );
}
