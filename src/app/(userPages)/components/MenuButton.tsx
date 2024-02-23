import React from "react";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";

type MenuButtonProps = {
  itemName: string;

  itemNumber: number;
  isActive: boolean;
  setActive: (active: string) => void;
};

export default function MenuButton({
  itemName,

  itemNumber,
  isActive,
  setActive,
}: MenuButtonProps) {
  const active = isActive ? "bg-primary shadow-2xl" : "bg-white";
  const activeText = isActive ? "font-bold" : "font-normal";

  return (
    <>
      <Button
        size={"lg"}
        className={`w-28 md:w-44 flex items-center relative ${active} border`}
        onClick={() => setActive(itemName)}
      >
        <p className={`hidden md:block absolute left-5 ${activeText}`}>
          {itemNumber}
        </p>
        <div
          className={`flex flex-row md:gap-2 justify-center w-full text-md ${activeText}`}
        >
          {itemName}
        </div>
        <MoveRight className="hidden md:block absolute right-3" size={20} />
      </Button>
    </>
  );
}
