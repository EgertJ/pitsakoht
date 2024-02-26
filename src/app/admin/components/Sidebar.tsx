import Link from "next/link";
import React from "react";
import {
  MdSupervisedUserCircle,
  MdShoppingBag,
  MdLogout,
  MdDashboard,
} from "react-icons/md";
import { RiCoupon2Line } from "react-icons/ri";

import { GiTomato } from "react-icons/gi";
import { BiNotepad } from "react-icons/bi";
import { logout } from "@/lib/shared/actions/actions";

export default function Sidebar() {
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <h1 className="text-2xl pb-16">Admin</h1>
        <div className="flex flex-col gap-4">
          <p className="text-sm font-bold">Leheküljed</p>
          <div className="flex text-xl  items-center gap-2">
            <MdDashboard />
            <Link href={"/admin"}>Pealeht</Link>
          </div>
          <div className="flex text-xl  items-center gap-2">
            <MdShoppingBag />
            <Link href={"/admin/tooted"}>Tooted</Link>
          </div>
          <div className="flex text-xl  items-center gap-2">
            <MdSupervisedUserCircle />
            <Link href={"/admin/kasutajad"}>Kasutajad</Link>
          </div>
          <div className="flex text-xl items-center gap-2">
            <GiTomato />
            <Link href={"/admin/koostisosad"}>Koostisosad</Link>
          </div>
          <div className="flex text-xl items-center gap-2">
            <BiNotepad />
            <Link href={"/admin/tellimused"}>Tellimused</Link>
          </div>
          <div className="flex text-xl items-center gap-2">
            <RiCoupon2Line />
            <Link href={"/admin/kupongid"}>Kupongid</Link>
          </div>
        </div>
      </div>
      <div className="flex text-xl  items-center gap-2">
        <div className="flex gap-2 items-center">
          <MdLogout />
          <form action={logout}>
            <button type="submit">Logi välja</button>
          </form>
        </div>
      </div>
    </div>
  );
}
