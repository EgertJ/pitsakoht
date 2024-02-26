"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { OrderStatus } from "@prisma/client";
import React, { useEffect, useState } from "react";
import Container from "./Container";
import Item from "./Item";
import { useQuery } from "@tanstack/react-query";
import { updateOrderStatus } from "../action";
import DeletionAlert from "./DeletionAlert";
import { toast } from "sonner";
import { OrderWithItemsAndAddons } from "@/lib/types";
import { getOrders } from "@/lib/shared/actions/actions";

export default function Orders() {
  const [fetchEnabled, setFetchEnabled] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const {
    data: orderData,
    error: orderError,
    isLoading: orderIsLoading,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => getOrders(),
    refetchInterval: 5000,
    enabled: fetchEnabled,
  });

  if (orderIsLoading) return <div>Laeb tellimusi...</div>;
  if (orderError)
    return <div>Viga tellimuste laadimisel: {orderError.message}</div>;
  if (!orderData?.data)
    return (
      <div className="flex align-middle justify-center">Tellimusi pole.</div>
    );

  const [orders, setOrders] = useState<OrderWithItemsAndAddons[]>(
    orderData?.data
  );

  useEffect(() => {
    if (orderData && orderData.data) {
      const newOrders = orderData.data;
      setOrders(newOrders);

      const newContainers = {
        ["Ootel"]: newOrders.filter((order) => order.status === "pending"),
        ["Tegemisel"]: newOrders.filter(
          (order) => order.status === "processing"
        ),
        ["Tehtud"]: newOrders.filter((order) => order.status === "completed"),
        ["Kätte antud"]: [],
      };

      setContainers(newContainers);
    }
  }, [orderData]);

  type containerType = {
    [name: string]: OrderWithItemsAndAddons[];
  };

  const [containers, setContainers] = useState<containerType>({
    ["Ootel"]: orders.filter((order) => order.status === "pending"),
    ["Tegemisel"]: orders.filter((order) => order.status === "processing"),
    ["Tehtud"]: orders.filter((order) => order.status === "completed"),
    ["Kätte antud"]: [],
  });
  const [activeContainer, setActiveContainer] = useState<string>("");

  const [activeOrderId, setActiveOrderId] = useState<null | string>(null);
  const [activeOrderToDelete, setActiveOrderToDelete] =
    useState<OrderWithItemsAndAddons | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),

    useSensor(TouchSensor)
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setFetchEnabled(false);
    setActiveOrderId(active.id as string);
  };

  const findContainer = (containers: containerType, id: string) => {
    if (id in containers) {
      return id;
    }

    const container = Object.keys(containers).find((key) =>
      containers[key].find((item) => item.id === id)
    );
    return container;
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    const activeContainer = findContainer(containers, active.id as string);
    const overContainer = findContainer(containers, over?.id as string);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setContainers((container) => {
      const activeItems = container[activeContainer];
      const overItems = container[overContainer];

      const activeIndex = activeItems.findIndex(
        (item) => item.id === active.id
      );
      const overIndex = overItems.findIndex((item) => item.id !== over?.id);

      return {
        ...container,
        [activeContainer]: [
          ...container[activeContainer].filter((item) => item.id !== active.id),
        ],
        [overContainer]: [
          ...container[overContainer].slice(0, overIndex),
          container[activeContainer][activeIndex],
          ...container[overContainer].slice(
            overIndex,
            container[overContainer].length
          ),
        ],
      };
    });
  };

  async function handleOrderStatusUpdate(id: string, status: OrderStatus) {
    const updatedOrder = await updateOrderStatus(id, status);
    if (updatedOrder.error) return updatedOrder.error;
    return updatedOrder.data;
  }

  const handleCancelDeletion = () => {
    setOpenDialog(false);

    setActiveOrderToDelete(null);
  };

  const handleConfirmDeletion = () => {
    if (activeOrderToDelete) {
      handleOrderStatusUpdate(activeOrderToDelete.id, "delivered")
        .then(() => {
          setContainers((boardSection) => ({
            ...boardSection,
            [activeContainer]: boardSection[activeContainer].filter(
              (task) => task.id !== activeOrderId
            ),
          }));
          setOpenDialog(false);
        })
        .catch((error) => {
          toast.error("Viga tellimuse kustutamisel: " + error.message);
        });
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const activeContainer = findContainer(containers, active.id as string);

    const overContainer = findContainer(containers, over?.id as string);

    if (!activeContainer || !overContainer) {
      return;
    }
    setActiveContainer(activeContainer);

    let newStatus: OrderStatus;
    switch (overContainer) {
      case "Kätte antud":
        newStatus = "delivered";
        break;
      case "Tehtud":
        newStatus = "completed";
        break;
      case "Tegemisel":
        newStatus = "processing";
        break;
      case "Ootel":
      default:
        newStatus = "pending";
        break;
    }

    const order = activeOrderId ? getOrderById(orders, activeOrderId) : null;

    if (overContainer === "Kätte antud" && order) {
      setOpenDialog(true);
      setActiveOrderToDelete(order);
    } else if (activeContainer === overContainer) {
      const activeIndex = containers[activeContainer].findIndex(
        (task) => task.id === active.id
      );
      const overIndex = containers[overContainer].findIndex(
        (task) => task.id === over?.id
      );

      if (activeIndex !== overIndex) {
        if (order) {
          handleOrderStatusUpdate(order?.id, newStatus);
        }
        setContainers((boardSection) => ({
          ...boardSection,
          [overContainer]: arrayMove(
            containers[overContainer],
            activeIndex,
            overIndex
          ),
        }));
      }
    }

    setActiveOrderId(null);
    setFetchEnabled(true);
  };

  const getOrderById = (orders: OrderWithItemsAndAddons[], id: string) => {
    return orders.find((order) => order.id === id);
  };

  const order = activeOrderId ? getOrderById(orders, activeOrderId) : null;

  return (
    <div>
      <DndContext
        id="dnd-context-container"
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-4">
          {Object.keys(containers).map((containerKey) => (
            <div key={containerKey}>
              <Container
                id={containerKey}
                title={containerKey}
                orders={containers[containerKey]}
              ></Container>
            </div>
          ))}
        </div>
        <DragOverlay>{order ? <Item order={order}></Item> : null}</DragOverlay>
      </DndContext>
      <DeletionAlert
        open={openDialog}
        onOpenChange={(isOpen) => setOpenDialog(isOpen)}
        handleCancel={() => handleCancelDeletion()}
        handleConfirm={() => handleConfirmDeletion()}
      ></DeletionAlert>
    </div>
  );
}
