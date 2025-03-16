"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LogOut, Ticket, ClipboardList } from "lucide-react";
import clsx from "clsx";
import { useUser, useAuth } from "@clerk/nextjs";

export function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const { signOut: clerkSignOut } = useAuth();

  const handleSignOut = async () => {
    await clerkSignOut();
    router.push("/login");
  };

  const navLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin/dashboard/manage-coupons", label: "Coupons", icon: Ticket },
    { href: "/admin/dashboard/claims", label: "Claims", icon: ClipboardList },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Admin Panel Title */}
          <Link href="/admin" className="flex items-center space-x-2">
            <span className="text-xl font-semibold text-gray-900">
              Admin Panel
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all",
                  pathname === href
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className="h-4 w-4 mr-1" />
                {label}
              </Link>
            ))}

            {/* User Email & Logout Button */}
            <div className="flex items-center space-x-4">
              {/* Show Skeleton Loader while fetching user data */}
              <div className="w-44 flex items-center justify-end">
                {isLoaded ? (
                  <span className="text-sm text-gray-600 truncate">
                    {user?.primaryEmailAddress?.emailAddress}
                  </span>
                ) : (
                  <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                )}
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
