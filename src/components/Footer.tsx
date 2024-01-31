import { Mail, Phone } from "lucide-react";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t-8 border-black px-4 md:px-24 lg:px-52 py-20">
      <div className=" flex md:justify-between flex-wrap gap-y-16 justify-center">
        <div className="flex flex-col gap-8  w-full md:w-fit">
          <div className="flex flex-col gap-4">
            <h1 className="font-bold text-xl">Kontaktandmed</h1>
            <div className="flex gap-2 ">
              <Mail />
              <a className="underline" href="mailto: Omare.oy@outlook.com">
                Omare.oy@outlook.com
              </a>
            </div>
            <div className="flex gap-2">
              <Phone />
              <a className="underline" href="tel:+37255570761">
                +372 555 707 61
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-xl font-bold">Sotsiaalmeedia</h1>
            <div className="flex gap-8">
              <a href="https://www.facebook.com/Pitsakoht">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-label="facebook"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/pitsakoht/">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-label="instagram"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a href="https://www.tiktok.com/@pitsakoht">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  aria-label="tiktok"
                >
                  <path d="M 9 4 C 6.2495759 4 4 6.2495759 4 9 L 4 41 C 4 43.750424 6.2495759 46 9 46 L 41 46 C 43.750424 46 46 43.750424 46 41 L 46 9 C 46 6.2495759 43.750424 4 41 4 L 9 4 z M 9 6 L 41 6 C 42.671576 6 44 7.3284241 44 9 L 44 41 C 44 42.671576 42.671576 44 41 44 L 9 44 C 7.3284241 44 6 42.671576 6 41 L 6 9 C 6 7.3284241 7.3284241 6 9 6 z M 26.042969 10 A 1.0001 1.0001 0 0 0 25.042969 10.998047 C 25.042969 10.998047 25.031984 15.873262 25.021484 20.759766 C 25.016184 23.203017 25.009799 25.64879 25.005859 27.490234 C 25.001922 29.331679 25 30.496833 25 30.59375 C 25 32.409009 23.351421 33.892578 21.472656 33.892578 C 19.608867 33.892578 18.121094 32.402853 18.121094 30.539062 C 18.121094 28.675273 19.608867 27.1875 21.472656 27.1875 C 21.535796 27.1875 21.663054 27.208245 21.880859 27.234375 A 1.0001 1.0001 0 0 0 23 26.240234 L 23 22.039062 A 1.0001 1.0001 0 0 0 22.0625 21.041016 C 21.906673 21.031216 21.710581 21.011719 21.472656 21.011719 C 16.223131 21.011719 11.945313 25.289537 11.945312 30.539062 C 11.945312 35.788589 16.223131 40.066406 21.472656 40.066406 C 26.72204 40.066409 31 35.788588 31 30.539062 L 31 21.490234 C 32.454611 22.653646 34.267517 23.390625 36.269531 23.390625 C 36.542588 23.390625 36.802305 23.374442 37.050781 23.351562 A 1.0001 1.0001 0 0 0 37.958984 22.355469 L 37.958984 17.685547 A 1.0001 1.0001 0 0 0 37.03125 16.6875 C 33.886609 16.461891 31.379838 14.012216 31.052734 10.896484 A 1.0001 1.0001 0 0 0 30.058594 10 L 26.042969 10 z M 27.041016 12 L 29.322266 12 C 30.049047 15.2987 32.626734 17.814404 35.958984 18.445312 L 35.958984 21.310547 C 33.820114 21.201935 31.941489 20.134948 30.835938 18.453125 A 1.0001 1.0001 0 0 0 29 19.003906 L 29 30.539062 C 29 34.707538 25.641273 38.066406 21.472656 38.066406 C 17.304181 38.066406 13.945312 34.707538 13.945312 30.539062 C 13.945312 26.538539 17.066083 23.363182 21 23.107422 L 21 25.283203 C 18.286416 25.535721 16.121094 27.762246 16.121094 30.539062 C 16.121094 33.483274 18.528445 35.892578 21.472656 35.892578 C 24.401892 35.892578 27 33.586491 27 30.59375 C 27 30.64267 27.001859 29.335571 27.005859 27.494141 C 27.009759 25.65271 27.016224 23.20692 27.021484 20.763672 C 27.030884 16.376775 27.039186 12.849206 27.041016 12 z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full md:w-fit">
          <h1 className="text-xl font-bold">Meie asukoht</h1>
          <p>Mustamäe tee 3a, Tallinn, Estonia</p>
          <iframe
            width="500"
            height="250"
            style={{ border: "0" }}
            loading="lazy"
            src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJ8WlCxYmUkkYR1is8tBgF2rI&key=AIzaSyDT4qIK_Mg3s-uLCRnM6rR8X0JQXtU-ySI"
            className="w-72 md:w-96"
          ></iframe>
        </div>
      </div>
      <div className="flex justify-between md:justify-start items-center w-full">
        <Image
          src="/logo.png"
          width={80}
          height={80}
          alt="pitsakoht logo"
          className="w-auto"
        ></Image>

        <div className="flex-grow"></div>

        <div className="flex flex-col md:items-center w-full md:flex-grow-0">
          <Link href="/privaatsuspoliitika">Privaatsuspoliitika</Link>
          <p>© 2023 Pitsakoht | Kõik õigused kaitstud</p>
        </div>
      </div>
    </footer>
  );
}
