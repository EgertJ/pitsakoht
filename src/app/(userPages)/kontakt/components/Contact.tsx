import React from "react";
import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <div className="px-3 md:px-24 lg:px-52 py-24">
      <div className="flex justify-center items-center">
        <h1 className="text-5xl font-bold pb-8">Võta meiega ühendust</h1>
      </div>

      <ContactForm></ContactForm>
    </div>
  );
}
