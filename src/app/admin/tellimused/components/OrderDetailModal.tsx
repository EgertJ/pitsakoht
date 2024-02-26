import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OrderWithItemsAndAddons } from "@/lib/types";
import { statusToText } from "@/utils/statusToText";
import { sizeToText } from "@/utils/sizeToText";
export default function OrderDetailModal({
  open,
  setOpen,
  orderDetails,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  orderDetails: OrderWithItemsAndAddons | undefined;
}) {
  if (orderDetails === undefined) return "";
  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{orderDetails.id}</DialogTitle>
          <DialogDescription>
            {orderDetails.name} {orderDetails.createdAt.toLocaleString("et-EE")}
          </DialogDescription>
        </DialogHeader>

        <p>E-mail: {orderDetails.email}</p>
        <p>Telefon: {orderDetails.phone}</p>
        <p>Kaasa/kohapeal: {orderDetails.takeaway ? "Kaasa" : "Kohapeal"}</p>
        <p>Staatus: {statusToText(orderDetails.status)}</p>

        <div className="flex gap-4 flex-col">
          {orderDetails.items.map((item, index) => (
            <div key={item.id}>
              <p className="font-bold">
                {index + 1}. {item.item.name} x{item.quantity}
              </p>
              {item.size && <p>{sizeToText(item.size)}</p>}

              <p className="font-light text-sm">
                {item.addons.map(
                  (addon, index) =>
                    index +
                    1 +
                    ". " +
                    addon.itemAddon.ingredient.name +
                    " x" +
                    addon.quantity +
                    " "
                )}
              </p>
            </div>
          ))}
        </div>
        <DialogFooter>{(orderDetails.total / 100).toFixed(2)}€</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
