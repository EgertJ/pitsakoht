import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function ShoppingCart({ className }: { className: string }) {
  return (
    <Sheet>
      <SheetTrigger className={className}>Ostukorv (0)</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Ostukorv (0)</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
