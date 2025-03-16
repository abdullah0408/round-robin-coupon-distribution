"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useUser, useAuth } from "@clerk/nextjs";
import { deleteCookie, getCookie } from "cookies-next";

export function UserNavbar() {
  // const pathname = usePathname();
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const { userId, signOut } = useAuth(); // userId will be null for guest users

  const guestId = getCookie("guestId"); // Retrieve guestId from cookies

  const handleSignOut = async () => {
    if (!userId) {
      // Guest user: Clear guest session cookies
      deleteCookie("guestId");
      deleteCookie("guestSessionId");
    } else {
      // Logged-in user: Clerk sign out and clear session cookie
      await signOut();
      deleteCookie("loggedInUserSessionId");
    }
    router.push("/sign-in");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 overflow-hidden">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* User Panel Title */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-semibold text-gray-900">
              User Panel
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {/* User Email / Guest ID & Logout Button */}
            <div className="flex items-center space-x-4">
              <div className="w-44 flex items-center justify-end">
                {isLoaded ? (
                  <span className="text-sm text-gray-600 truncate w-full text-right">
                    {userId
                      ? user?.primaryEmailAddress?.emailAddress
                      : `Guest User: ${guestId || "Unknown"}`}
                  </span>
                ) : (
                  <div className="h-4 w-44 bg-gray-200 rounded animate-pulse" />
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
