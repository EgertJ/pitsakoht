import { Facebook, Mail, Phone } from "lucide-react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t-8 border-black px-4 md:px-24 lg:px-52 py-20 bg-gray-100 ">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 w-full gap-y-10 lg:justify-items-center">
        <div className="flex flex-col gap-4 w-full md:w-fit">
          {/* Lahtiolekuajad */}
          <h1 className="font-bold">Lahtiolekuajad</h1>
          <div className="text-sm flex flex-col gap-2">
            <p>esmaspäev 16:00–21:00</p>
            <p>teisipäev 16:00–21:00</p>
            <p>kolmapäev 16:00–21:00</p>
            <p>neljapäev 16:00–21:00</p>
            <p>reede 16:00–21:00</p>
            <p>laupäev 16:00–21:00</p>
            <p>pühapäev 16:00–21:00</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full md:w-fit">
          {/* Lingid */}
          <h1 className="font-bold">Lingid</h1>
          <div className="text-sm flex flex-col gap-2">
            <Link href="/" className="underline">
              Avaleht
            </Link>
            <Link href="/kontakt" className="underline">
              Kontakt
            </Link>
            <Link href="/minu-konto" className="underline">
              Minu konto
            </Link>
            <Link href="/logi-sisse" className="underline">
              Logi sisse
            </Link>

            <Link href="/registreeru" className="underline">
              Registreeru
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-8 w-full md:w-fit">
          {/* Kontaktandmed */}
          <div className="flex flex-col gap-4">
            <h1 className="font-bold">Kontaktandmed</h1>
            <div className="flex gap-2 items-center">
              <Mail />
              <a
                className="underline text-sm"
                href="mailto:Omare.oy@outlook.com"
              >
                Omare.oy@outlook.com
              </a>
            </div>
            <div className="flex gap-2 items-center">
              <Phone />
              <a className="underline text-sm" href="tel:+37255570761">
                +372 555 707 61
              </a>
            </div>
          </div>
          <div>
            <a
              href="https://www.google.com/maps?q=59.428187,24.7041383"
              className="text-sm underline"
            >
              Mustamäe tee 3a, Tallinn, Estonia
            </a>
          </div>
          <div className="flex justify-between">
            <a href="https://www.facebook.com/Pitsakoht">
              <FaFacebook size={30}></FaFacebook>
            </a>
            <a href="https://www.instagram.com/pitsakoht/">
              <FaInstagram size={30}></FaInstagram>
            </a>
            <a href="https://www.tiktok.com/@pitsakoht">
              <FaTiktok size={30}></FaTiktok>
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:items-center w-full md:flex-grow-0 mt-10">
        <Link href="/privaatsuspoliitika" className="underline">
          Privaatsuspoliitika
        </Link>
        <p className=" mt-2">© 2023 Pitsakoht | Kõik õigused kaitstud</p>
      </div>
    </footer>
  );
}
