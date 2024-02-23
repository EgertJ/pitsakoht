import React from "react";
import Sidebar from "./components/Sidebar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex ">
      <div className="flex-[1] bg-[#1D1D42] p-6 text-white h-screen sticky top-0">
        <Sidebar />
      </div>
      <div className="flex-[4] p-6">{children}</div>
    </div>
  );
}
