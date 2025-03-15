import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/dashboard(.*)",
  "/"
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  const { userId, redirectToSignIn } = await auth();
  if (userId) {

    const response = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch user:", response.status, response.statusText);
      return redirectToSignIn();
    }

    const user = await response.json();

    if (!user || user?.error) {
      console.error("Error fetching user:", user?.error);
      return redirectToSignIn();
    }

    const role = user?.public_metadata?.role;

    if (role === "admin" && request.nextUrl.pathname === "/dashboard") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    if (role !== "admin" && request.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

  } 
  
  if (!userId) {

    const guestID = request.cookies.get("guestId")?.value;

    if (!guestID && request.nextUrl.pathname !== "/sign-up") {
        return NextResponse.redirect(new URL("/sign-up", request.url));
    }

  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
