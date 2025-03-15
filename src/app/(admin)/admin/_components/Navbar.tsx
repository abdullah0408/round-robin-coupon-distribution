"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LogOut, Ticket, ClipboardList } from "lucide-react";
import clsx from "clsx";

export function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = () => {
    // Add your sign-out logic here (e.g., clear auth state, call API)
    router.push("/login");
  };

  const navLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin/dashboard/manage-coupons", label: "Coupons", icon: Ticket },
    { href: "/admin/dashobard/claims", label: "Claims", icon: ClipboardList },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/admin" className="flex items-center space-x-2">
              <span className="text-xl font-semibold text-gray-900">Admin Panel</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium",
                  pathname === href ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className="h-4 w-4 mr-1" />
                {label}
              </Link>
            ))}

            <button
              onClick={signOut}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
