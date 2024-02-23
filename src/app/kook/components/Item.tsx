import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderWithItemsAndAddons } from "@/lib/types";
import { sizeToText } from "@/utils/sizeToText";
import React from "react";

type ItemProps = {
  order: OrderWithItemsAndAddons;
};

export default function Item({ order }: ItemProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{order.id}</CardTitle>
        <CardDescription>
          {order.name}, {order.phone}, {order.email}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {order.items.map((item, index) => (
          <div key={item.orderId + item.id}>
            <h1 className="font-bold">
              {index + 1}. {item.item.name}{" "}
              {item.size ? `(${sizeToText(item.size)}) ` : ""}x{item.quantity}
            </h1>

            {item.addons
              ? item.addons.map((addon) => (
                  <div key={addon.ingredientId}>
                    <p className="text-sm">
                      {addon.itemAddon.ingredient.name} x{addon.quantity}
                    </p>
                  </div>
                ))
              : ""}
          </div>
        ))}
      </CardContent>
      <CardFooter>{(order.total / 100).toFixed(2)}€</CardFooter>
    </Card>
  );
}
