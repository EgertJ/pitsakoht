import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import PizzaMaking from "../PizzaMaking";

export default function ItemCard() {
  return (
    <Card className="w-full h-full border-none">
      <CardHeader className="p-0 h-56 relative bg-gray-100">
        <Image
          src="/Hakkliha.jpg"
          fill={true}
          alt="hakklihapitsa"
          className="object-cover"
          sizes="(min-width: 768px) 50vw, 100vw"
        ></Image>
      </CardHeader>
      <CardContent>
        <div className="grid w-full gap-8 justify-center">
          <h1 className="font-medium text-xl">Hakklihapitsa</h1>
          <p className="font-thin">
            Hakkliha, sibul, marin. kurk, chipotle kaste, juust, tomatikaste
          </p>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <p className="font-bold">Alates 8.40€</p>
        <PizzaMaking />
      </CardFooter>
    </Card>
  );
}
