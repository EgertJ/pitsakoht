import OrderDetails from "@/app/(userPages)/tellimus/[id]/components/OrderDetails";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getOrder } from "./action";
import { getUser } from "@/lib/shared/actions/actions";
import { redirect } from "next/navigation";

export default async function TellimusPage({
  params,
}: {
  params: { id: string };
}) {
  const { user } = await getUser();

  if (user && !user.emailVerified) redirect("/valideeri");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["order"],
    queryFn: () => getOrder(params.id),
  });
  return (
    <div className="px-3 md:px-24 lg:px-52 py-24">
      <div className="flex justify-center items-center">
        <h1 className="text-5xl font-bold pb-8">Täname tellimuse eest!</h1>
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <OrderDetails id={params.id} />
      </HydrationBoundary>
    </div>
  );
}
