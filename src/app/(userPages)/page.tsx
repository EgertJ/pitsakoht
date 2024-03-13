import Hero from "@/app/(userPages)/components/Hero";
import Menu from "@/app/(userPages)/components/Menu";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import ShoppingCartButton from "@/components/ui/ShoppingCartButton";
import { getCategories } from "./action";
import { validateRequest } from "@/lib/getUser";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await validateRequest();

  if (user && !user.emailVerified) redirect("/valideeri");

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
