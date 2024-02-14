import Navbar from "@/components/Navbar";
import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Provider from "@/utils/Providers";
import { Toaster } from "@/components/ui/sonner";
export const metadata: Metadata = {
  title: "Pitsakoht",
  description: "Pitsakoht veebileht",
};

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className={inter.className}>
        <Navbar />
        <Provider>{children}</Provider>
        <Toaster richColors />
        <Footer />
      </body>
    </html>
  );
}
