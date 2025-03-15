import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  try {
    const { id, code, totalissued, status } = await req.json();
    
    if (!id || !code || totalissued < 0) {
      return NextResponse.json({ message: "Invalid data provided." }, { status: 400 });
    }
    
    const updatedCoupon = await prisma.coupon.update({
      where: { id },
      data: { code, totalissued, status },
    });
    
    return NextResponse.json(updatedCoupon, { status: 200 });
  } catch (error) {
    console.error("Error updating coupon:", error);
    return NextResponse.json({ message: "Error updating coupon." }, { status: 500 });
  }
}