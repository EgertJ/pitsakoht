import { logout } from "@/lib/shared/actions/actions";
import { User } from "lucia";
import Link from "next/link";

export default function AccountMenu({ user }: { user: User | null }) {
  return (
    <div className="relative group">
      <button
        className="hover:border-b-primary hover:border-b-2 border-b-2 border-b-gray-100 p-4 inline-block"
        aria-haspopup="true"
      >
        Minu konto ▼
      </button>
      <div
        className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 transition ease-in-out duration-150 opacity-0 group-hover:opacity-100 z-50"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="user-menu"
      >
        {user && (
          <>
            <Link
              href="/muuda-andmeid"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
              role="menuitem"
            >
              Vaheta kasutaja andmeid
            </Link>
            <Link
              href="/minu-tellimused"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
              role="menuitem"
            >
              Minu tellimused
            </Link>
            <form
              action={logout}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
            >
              <button
                role="menuitem"
                type="submit"
                className="w-full justify-start flex"
              >
                Logi välja
              </button>
            </form>
          </>
        )}
        {!user && (
          <>
            <Link
              href="/logi-sisse"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Logi sisse
            </Link>
            <Link
              href="/registreeru"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Registreeru
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
