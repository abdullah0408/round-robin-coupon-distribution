import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust the import path if needed

export async function GET() {
  try {
    const claims = await prisma.claim.findMany({
      include: {
        coupon: {
          select: {
            code: true,
          },
        },
      },
    });
    return NextResponse.json(claims);
  } catch (error) {
    console.error("Failed to fetch claims", error);
    return NextResponse.json(
      { message: "Failed to fetch claims" },
      { status: 500 }
    );
  }
}
