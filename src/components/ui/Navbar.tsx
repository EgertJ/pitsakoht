import Link from "next/link";
import React from "react";
import Image from "next/image";
import ShoppingCart from "./ShoppingCart";
import MobileNav from "./MobileNav";
import AccountMenu from "../AccountMenu";
import { validateRequest } from "@/lib/getUser";

export default async function Navbar() {
  const { user } = await validateRequest();

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

        <div className={`lg:flex gap-10 hidden `}>
          <Link
            href="/"
            className="hover:border-b-primary hover:border-b-2 border-b-2 border-b-gray-100 p-4"
          >
            Avaleht
          </Link>
          <Link
            href="/kontakt"
            className="hover:border-b-primary hover:border-b-2 border-b-2 border-b-gray-100 p-4"
          >
            Kontakt
          </Link>

          <AccountMenu user={user} />

          <ShoppingCart
            className="hover:border-b-primary hover:border-b-2 border-b-2 border-b-gray-100 bg-gray-100 text-md hover:bg-gray-100 rounded-none h-full p-4"
            icon={false}
          />
        </div>
      </nav>

      <MobileNav user={user} />
    </div>
  );
}
