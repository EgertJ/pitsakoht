"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getOrder } from "../action";
import { CheckCircle2 } from "lucide-react";
import { sizeToText } from "@/utils/sizeToText";

export default function OrderDetails({ id }: { id: string }) {
  const [completed, setCompleted] = useState(true);

  const {
    data: orderData,
    error: orderError,
    isLoading: orderLoading,
  } = useQuery({
    queryKey: ["order"],
    queryFn: () => getOrder(id),
    refetchInterval: 5000,
    enabled: completed,
  });

  useEffect(() => {
    setCompleted(orderData?.data?.status !== "delivered");
  }, [orderData]);

  if (orderLoading) return <div>Laeb tellimust...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center w-full gap-y-8 p-4 bg-gray-100 justify-between">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="font-bold text-xl">Tellimuse detailid</h1>
          <div className="flex flex-row gap-2">
            <p className="font-bold">Tellimuse kuupäev:</p>
            <p>{orderData?.data?.createdAt.toLocaleString("et-EE")}</p>
          </div>
          <div className="flex flex-row gap-2">
            <p className="font-bold">Tellija nimi:</p>
            <p>{orderData?.data?.name}</p>
          </div>
          <div className="flex flex-row gap-2">
            <p className="font-bold">Tellija e-mail:</p>
            <p>{orderData?.data?.email}</p>
          </div>
          <div className="flex flex-row gap-2">
            <p className="font-bold">Tellija telefon:</p>
            <p>{orderData?.data?.phone}</p>
          </div>
          {orderData?.data?.total && (
            <div className="flex flex-row gap-2">
              <p className="font-bold">Tellimus kokku:</p>
              <p>{(orderData?.data?.total / 100).toFixed(2)}€</p>
            </div>
          )}
        </div>
      </div>
      <div>
        <div className="flex gap-4 flex-col">
          <h1 className="font-bold text-xl">Tellimuse staatus</h1>
          <div className="flex gap-9 flex-col">
            <div
              className={`flex gap-2 ${
                orderData?.data?.status === "pending"
                  ? "animate-pulse"
                  : "text-green-500"
              }`}
            >
              <CheckCircle2 />
              <p>Ootel</p>
            </div>
            <div
              className={`flex gap-2 ${
                orderData?.data?.status === "processing" ? "animate-pulse" : ""
              } ${
                orderData?.data?.status === "completed" ||
                orderData?.data?.status === "delivered"
                  ? "text-green-500"
                  : ""
              }`}
            >
              <CheckCircle2 />
              <p>Tegemisel</p>
            </div>
            <div
              className={`flex gap-2 ${
                orderData?.data?.status === "completed" ||
                orderData?.data?.status === "delivered"
                  ? "text-green-500"
                  : ""
              }`}
            >
              <CheckCircle2 />
              <p>Valmis</p>
            </div>
            <div
              className={`flex gap-2 ${
                orderData?.data?.status === "completed" ? "animate-pulse" : ""
              } ${
                orderData?.data?.status === "delivered" ? "text-green-500" : ""
              }`}
            >
              <CheckCircle2 />
              <p>Kätte antud</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h1 className="font-bold text-xl">Tellimus</h1>
        <div className="flex flex-col gap-2">
          {orderData?.data?.items.map((item, index) => (
            <div key={item.id}>
              {item.size ? (
                <h1>
                  {index + 1}. {item.item.name} x{item.quantity} (
                  {sizeToText(item.size)})
                </h1>
              ) : (
                <h1>
                  {index + 1}. {item.item.name} x{item.quantity}
                </h1>
              )}

              <div className="flex gap-2">
                {item.addons.map((addon, index) => (
                  <p className="text-xs font-light" key={index}>
                    {addon.itemAddon.ingredient.name} x{addon.quantity}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
