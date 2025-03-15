import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Coupon ID is required" }, { status: 400 });
    }

    await prisma.coupon.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Coupon deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
