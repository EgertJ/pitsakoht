import React from "react";
import PrivacyPolicy from "./components/PrivacyPolicy";

export default function PrivaatsuspoliitikaPage() {
  return (
    <div className="px-3 md:px-24 lg:px-52 py-24">
      <div className="flex justify-center items-center">
        <h1 className="text-5xl font-bold pb-8">Privaatsuspoliitika</h1>
      </div>

      <PrivacyPolicy />
    </div>
  );
}
