"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import Item from "./Item";
import { OrderWithItemsAndAddons } from "@/lib/types";

type ContainerProps = {
  id: string;
  title: string;
  orders: OrderWithItemsAndAddons[];
};

export default function Container({ id, title, orders }: ContainerProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="h-screen overflow-auto bg-white p-4 border">
      <h1 className="text-black text-xl font-bold pb-4">{title}</h1>
      <SortableContext
        id={id}
        items={orders}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef}>
          {orders.map((order) => (
            <SortableItem id={order.id} key={order.id}>
              <Item order={order}></Item>
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
