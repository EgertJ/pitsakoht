"use client";

import Link from "next/link";
import React, { useState } from "react";
import { User } from "lucia";
import { logout } from "@/lib/shared/actions/actions";

export default function MobileNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="lg:hidden absolute right-10 top-14">
        <button onClick={toggleMenu} aria-label="menüü-toggle">
          <span className="block w-6 h-0.5 bg-black mb-1"></span>
          <span className="block w-6 h-0.5 bg-black mb-1"></span>
          <span className="block w-6 h-0.5 bg-black"></span>
        </button>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden flex flex-col gap-4 pt-4  items-center">
          <Link href="/">Avaleht</Link>
          <Link href="/kontakt">Kontakt</Link>
        </div>
      )}
    </>
  );
}
