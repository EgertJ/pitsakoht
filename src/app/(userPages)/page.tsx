import Hero from "@/app/(userPages)/components/Hero";
import Menu from "@/app/(userPages)/components/Menu";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import ShoppingCartButton from "@/components/ui/ShoppingCartButton";
import { getCategories } from "./action";

export default async function Home() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
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
