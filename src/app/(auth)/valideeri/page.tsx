import ValidationInput from "@/components/ui/ValidationInput";
import React from "react";

export default function page() {
  return (
    <div className="px-3 md:px-24 lg:px-52 py-24">
      <div className="flex justify-center items-center">
        <h1 className="text-5xl font-bold pb-8">Valideeri kood</h1>
      </div>

      <ValidationInput></ValidationInput>
    </div>
  );
}
