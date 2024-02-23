import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
