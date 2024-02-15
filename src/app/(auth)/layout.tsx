import { getUser } from "../actions";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getUser();

  if (user && user.emailVerified) {
    return redirect("/");
  }
  return <>{children}</>;
}
