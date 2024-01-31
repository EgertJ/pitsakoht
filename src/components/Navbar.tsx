"use client";

import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import ShoppingCart from "./ShoppingCart";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="px-4 md:px-24 lg:px-52 py-6 border-b bg-gray-100">
      <nav aria-label="peamenüü" className="flex justify-between items-center">
        <div className="w-20 h-20">
          <Link href="/" className="relative w-full h-full block">
            <Image
              src="/logo.png"
              fill={true}
              alt="Pitsakoht logo"
              priority={true}
              sizes="(max-width: 768px) 5rem, (max-width: 1024px) 5rem, 5rem"
            />
          </Link>
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu}>
            <span className="block w-6 h-0.5 bg-black mb-1"></span>
            <span className="block w-6 h-0.5 bg-black mb-1"></span>
            <span className="block w-6 h-0.5 bg-black"></span>
          </button>
        </div>

        <div className={`md:flex gap-10 hidden `}>
          <Link href="/" className="hover:bg-gray-500 rounded-md p-4">
            Avaleht
          </Link>
          <Link href="/kontakt" className="hover:bg-gray-500 rounded-md p-4">
            Kontakt
          </Link>

          <Link href="/minu-konto" className="hover:bg-gray-500 rounded-md p-4">
            Minu konto
          </Link>
          <ShoppingCart className="flex md:p-4 hover:bg-gray-500 rounded-md" />
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden flex flex-col gap-4 pt-4">
          <Link href="/">Avaleht</Link>
          <Link href="/kontakt">Kontakt</Link>
          <Link href="/minu-konto">Minu konto</Link>
          <ShoppingCart className="flex md:p-4" />
        </div>
      )}
    </div>
  );
}
