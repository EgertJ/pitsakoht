import React, { useState } from "react";
import { Button } from "./button";

export default function ButtonWithCounter({
  buttonText,
  type,
}: {
  buttonText: string;
  type: "submit" | "reset" | "button" | undefined;
}) {
  const [count, setCount] = useState<number>(1);
  const increment = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const decrement = () => {
    setCount((prevCount) => (prevCount > 1 ? prevCount - 1 : prevCount));
  };

  return (
    <div className="flex align-middle w-full h-11">
      <Button
        type={type}
        size={"lg"}
        className="w-9/12 rounded-r-none text-black text-lg"
      >
        {buttonText}
      </Button>
      <div className="flex w-[94px] align-middle ">
        <span className="bg-primary h-11 w-[57px] text-center border-x-2 font-bold text-lg flex items-center justify-center">
          {count}
        </span>
        <div className="h-full inline-block relative">
          <button
            onClick={increment}
            aria-label="Lisa juurde"
            className="cursor-pointer relative block w-[37px] h-1/2 bg-primary rounded-tr-md"
          >
            ▲
          </button>

          <button
            onClick={decrement}
            aria-label="Võta vähemaks"
            disabled={count === 1}
            className="cursor-pointer relative block w-[37px] h-1/2 bg-primary rounded-br-md"
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  );
}
