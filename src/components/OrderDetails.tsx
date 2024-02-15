"use client";
import { getOrder } from "@/app/actions";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useCartStore } from "../../store";

export default function OrderDetails({ id }: { id: string }) {
  const [completed, setCompleted] = useState(true);

  const { data: orderData, error: orderError } = useQuery({
    queryKey: ["order"],
    queryFn: () => getOrder(id),
    refetchInterval: 5000,
    enabled: completed,
  });

  useEffect(() => {
    setCompleted(orderData?.data?.status !== "completed");
  }, [orderData]);

  return (
    <div>
      <p>{orderData?.data?.email}</p>
      <p>{orderData?.data?.id}</p>
      <p>{orderData?.data?.status}</p>
    </div>
  );
}
