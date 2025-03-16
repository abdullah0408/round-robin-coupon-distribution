// app/api/get-coupon/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { headers, cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";
export async function GET() {
  const authData = await auth();
  let sessionId;
  const userId = authData.userId;
  let userEmail: string | null = null;
  let guestId: string | null = null;
  const ip = (await headers()).get("x-forwarded-for")?.split(',')[0]?.trim() || "Unknown IP"; // Get first IP in chain

  // Common user data fetch logic
  const fetchUserData = async () => {
    if (userId) {
      const cookieStore = await cookies();
      sessionId = cookieStore.get("loggedInUserSessionId")?.value || null;

      if (!sessionId) {
        throw new Error("Invalid session. Please refresh the page.");
      }

      const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        return userData.email_addresses?.[0]?.email_address || null;
      }
    }
    return null;
  };

  try {
    // Get user email if logged in
    userEmail = await fetchUserData();

    // Handle guest users
    if (!userId) {
      const cookieStore = await cookies();
      guestId = cookieStore.get("guestId")?.value || null;
      sessionId = cookieStore.get("guestSessionId")?.value || null;

      if (!guestId || !sessionId) {
        throw new Error("Invalid session. Please refresh the page.");
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Check for existing claims with the same session ID (PERMANENT BLOCK)
      const existingSessionClaim = await tx.claim.findFirst({
        where: { sessionId: sessionId! },
      });

      if (existingSessionClaim) {
        throw new Error("A coupon has already been claimed in this session.");
      }

      // 2. Check for IP-based claims within last 10 minutes (TEMPORARY BLOCK)
      const twentyFourHoursAgo = new Date(Date.now() - 10 * 60 * 1000);
      const existingIPClaim = await tx.claim.findFirst({
        where: {
          ip,
          createdAt: { gte: twentyFourHoursAgo },
        },
      });

      if (existingIPClaim) {
        throw new Error("This IP address has already claimed a coupon recently. Please wait 10 minutes.");
      }

      // Existing coupon selection logic
      const availableCoupons = await tx.coupon.findMany({
        where: {
          status: 'Active',
          totalused: { lt: prisma.coupon.fields.totalissued },
        },
        orderBy: { updatedAt: 'asc' },
        take: 1,
      });

      if (availableCoupons.length === 0) {
        throw new Error('No available coupons');
      }

      const selectedCoupon = availableCoupons[0];

      // Update coupon usage
      const updatedCoupon = await tx.coupon.update({
        where: { id: selectedCoupon.id },
        data: {
          totalused: { increment: 1 },
          updatedAt: new Date(),
        },
      });

      // Create claim record
      const claim = await tx.claim.create({
        data: {
          secret: uuidv4(),
          userId: userId || null,
          userEmail,
          guestId: guestId || null,
          sessionId: sessionId!,
          ip,
          couponId: selectedCoupon.id,
        },
      });

      return { coupon: updatedCoupon, claim };
    });

    return NextResponse.json({
      code: result.coupon.code,
      secret: result.claim.secret,
      message: 'Coupon claimed successfully'
    }, { status: 200 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    let status = 500;
    let suggestion = 'Please contact support';

    switch (true) {
      case errorMessage.includes('No available coupons'):
        status = 404;
        suggestion = 'Try again later';
        break;
      case errorMessage.includes('this session'):
        status = 403;
        suggestion = 'Only one coupon per session allowed';
        break;
      case errorMessage.includes('IP address has already claimed'):
        status = 429;
        suggestion = 'Wait  10 minutes from this network';
        break;
      case errorMessage.includes('Invalid session'):
        status = 401;
        suggestion = 'Refresh the page';
        break;
    }

    return NextResponse.json(
      { 
        message: errorMessage,
        suggestion
      },
      { status }
    );
  }
}