import { OrderStatus } from "@prisma/client";

export function statusToText(status: OrderStatus) {
  if (status === "pending") return "Ootel";
  if (status === "processing") return "Tegemisel";
  if (status === "completed") return "Valmis";
  if (status === "delivered") return "Kätte antud";
}
