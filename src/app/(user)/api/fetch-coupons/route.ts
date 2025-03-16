import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";


export async function GET() {
  try {
    const cookieStore = await cookies();
    const authData = await auth();
    const userId = authData.userId;
    const guestId = cookieStore.get("guestId")?.value;

    if (!userId && !guestId) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 401 }
      );
    }

    let claims;
    if (userId) {
      claims = await prisma.claim.findMany({
        where: { userId },
        include: {
          coupon: {
            select: {
              code: true,
              status: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      });
    } else if (guestId) {
      claims = await prisma.claim.findMany({
        where: { guestId },
        include: {
          coupon: {
            select: {
              code: true,
              status: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      });
    }

    if (!claims || claims.length === 0) {
      return NextResponse.json(
        { message: "No coupon history found" },
        { status: 404 }
      );
    }

    // ✅ Fixed secret property issue
    const formattedClaims = claims.map(claim => ({
      id: claim.id,
      coupon: {
        code: claim.coupon.code,
        status: claim.coupon.status
      },
      secret: claim.secret, // ✅ Now properly included
      createdAt: claim.createdAt.toISOString(),
      used: claim.used
    }));

    return NextResponse.json(formattedClaims, { status: 200 });

  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
