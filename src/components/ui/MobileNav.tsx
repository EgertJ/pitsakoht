"use client";

import Link from "next/link";
import React, { useState } from "react";
import ShoppingCart from "./ShoppingCart";
import { User } from "lucia";
import { logout } from "@/lib/shared/actions/actions";

export default function MobileNav({ user }: { user: User | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="lg:hidden absolute right-10 top-14">
        <button onClick={toggleMenu}>
          <span className="block w-6 h-0.5 bg-black mb-1"></span>
          <span className="block w-6 h-0.5 bg-black mb-1"></span>
          <span className="block w-6 h-0.5 bg-black"></span>
        </button>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden flex flex-col gap-4 pt-4  items-center">
          <Link href="/">Avaleht</Link>
          <Link href="/kontakt">Kontakt</Link>
          {user && (
            <>
              <Link href="/vaheta-kasutaja-andmeid" role="menuitem">
                Vaheta kasutaja andmeid
              </Link>
              <Link href="/minu-tellimused" role="menuitem">
                Minu tellimused
              </Link>
              <form action={logout}>
                <button role="menuitem" type="submit">
                  Logi välja
                </button>
              </form>
            </>
          )}
          {!user && (
            <>
              <Link href="/logi-sisse" role="menuitem">
                Logi sisse
              </Link>
              <Link href="/registreeru" role="menuitem">
                Registreeru
              </Link>
            </>
          )}
          <ShoppingCart
            className="text-md hover:bg-gray-100 bg-gray-100 rounded-none h-full p-0"
            icon={false}
          />
        </div>
      )}
    </>
  );
}
