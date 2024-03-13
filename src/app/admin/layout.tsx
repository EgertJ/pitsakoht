import React from "react";
import Sidebar from "./components/Sidebar";
import { validateRequest } from "@/lib/getUser";
import { redirect } from "next/navigation";

export default async function layout({ children }: { children: React.ReactNode }) {

  const { user } = await validateRequest();

  if (!user || !user.emailVerified || user.role !== "ADMIN") redirect("/");

  return (
    <div className="flex ">
      <div className="flex-[1] bg-[#1D1D42] p-6 text-white h-screen sticky top-0">
        <Sidebar />
      </div>
      <div className="flex-[4] p-6">{children}</div>
    </div>
  );
}
