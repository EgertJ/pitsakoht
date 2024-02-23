import React from "react";
import CartItems from "./CartItems";
import CheckoutForm from "./CheckoutForm";
import { getUser } from "@/lib/shared/actions/actions";

export default async function Checkout() {
  const { user } = await getUser();

  return (
    <div className="px-3 md:px-24 lg:px-52 py-24">
      <div className="flex justify-center items-center">
        <h1 className="text-5xl font-bold pb-8">Kinnita tellimus</h1>
      </div>
      <div className="flex justify-between md:justify-center pb-12">
        <CartItems></CartItems>
      </div>
      <CheckoutForm user={user}></CheckoutForm>
    </div>
  );
}
