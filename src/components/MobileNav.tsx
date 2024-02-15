"use client";

import Link from "next/link";
import React, { useState } from "react";
import ShoppingCart from "./ShoppingCart";

export default function MobileNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="md:hidden absolute right-10 top-14">
        <button onClick={toggleMenu}>
          <span className="block w-6 h-0.5 bg-black mb-1"></span>
          <span className="block w-6 h-0.5 bg-black mb-1"></span>
          <span className="block w-6 h-0.5 bg-black"></span>
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden flex flex-col gap-4 pt-4  items-center">
          <Link href="/">Avaleht</Link>
          <Link href="/kontakt">Kontakt</Link>
          <Link href="/minu-konto">Minu konto</Link>
          <ShoppingCart
            className="text-md hover:bg-gray-100 bg-gray-100 rounded-none h-full p-0"
            icon={false}
          />
        </div>
      )}
    </>
  );
}
