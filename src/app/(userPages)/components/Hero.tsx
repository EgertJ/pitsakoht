import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MoveDown } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="w-full px-4 sm:px-11 md:px-24 lg:px-52 py-24 flex flex-col md:flex-row gap-8 md:gap-24 items-center overflow-hidden justify-center relative">
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>

      <div className="flex flex-col gap-8 md:max-w-md text-center md:text-left z-50 text-white">
        <h1 className="font-bold text-5xl text-center">
          Pitsad igale maitsele
        </h1>
        <p className="text-md text-center">
          Meie pakume traditsioonilises kivipõhjaga ahjus küpsetatud pitsasid
        </p>

        <Button size={"lg"} className="text-md my-8" asChild>
          <Link href="#menüü" className="text-black">
            Menüü
            <MoveDown size={16} />
          </Link>
        </Button>
      </div>

      <Image
        src="/hero2.jpg"
        alt="pitsakoht avaleht pilt"
        fill
        quality={100}
        priority
        className="object-cover object-center"
        sizes="(min-width: 768px) 50vw, 100vw"
      />
    </div>
  );
}
