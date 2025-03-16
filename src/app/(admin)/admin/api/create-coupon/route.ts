import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { code, totalissued, status } = await req.json();

    if (!code || totalissued <= 0) {
      return NextResponse.json({ message: "Invalid coupon data" }, { status: 400 });
    }

    const newCoupon = await prisma.coupon.create({
      data: {
        code,
        totalissued,
        totalused: 0, // Default value
        status
      },
    });

    return NextResponse.json(newCoupon, { status: 201 });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return NextResponse.json({ message: "Error creating coupon" }, { status: 500 });
  }
}
