import React, { useState } from "react";
import { Button } from "./button";

export default function ButtonWithCounter({
  buttonText,
  type,
  count,
  setCount,
  onClick,
}: {
  buttonText: string;
  type: "submit" | "reset" | "button" | undefined;
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  onClick: () => void;
}) {
  const increment = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const decrement = () => {
    setCount((prevCount) => (prevCount > 1 ? prevCount - 1 : prevCount));
  };

  return (
    <div className="flex h-11 w-full">
      <div className="w-3/4">
        <Button
          type={type}
          size={"lg"}
          className="w-full rounded-r-none text-black text-md"
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </div>
      <div className="flex w-1/4 align-middle ">
        <span className="bg-primary h-11 w-1/2 text-center border-x-2 font-bold text-md flex items-center justify-center">
          {count}
        </span>
        <div className="h-full inline-block relative w-1/2">
          <button
            onClick={increment}
            aria-label="Lisa juurde"
            className="cursor-pointer relative block w-full h-1/2 bg-primary rounded-tr-md"
          >
            ▲
          </button>

          <button
            onClick={decrement}
            aria-label="Võta vähemaks"
            disabled={count === 1}
            className="cursor-pointer relative block w-full h-1/2 bg-primary rounded-br-md"
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  );
}
