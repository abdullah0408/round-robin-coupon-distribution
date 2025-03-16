import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {

    const coupons = await prisma.coupon.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });

    return NextResponse.json(coupons, { status: 200 });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json({ message: "Error fetching coupons" }, { status: 500 });
  }
}
