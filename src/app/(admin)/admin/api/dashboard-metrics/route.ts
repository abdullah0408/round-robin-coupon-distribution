import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Overall metrics with BigInt conversion
    const totalClaims = Number(await prisma.claim.count());
    const usedClaims = Number(await prisma.claim.count({ where: { used: true } }));
    const unusedClaims = totalClaims - usedClaims;

    const totalCoupons = Number(await prisma.coupon.count());
    const activeCoupons = Number(await prisma.coupon.count({
      where: { status: "Active" },
    }));
    const inactiveCoupons = totalCoupons - activeCoupons;

    // Group claims by day for the last 30 days (if available)
    const claimsOverTimeRaw: { date: string; count: bigint }[] = await prisma.$queryRaw`
      SELECT DATE("createdAt") as date, COUNT(*) as count
      FROM "Claim"
      WHERE DATE("createdAt") >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE("createdAt")
      ORDER BY DATE("createdAt") ASC
    `;
    const claimsOverTime = claimsOverTimeRaw.map((item: { date: string; count: bigint }) => ({
      date: item.date,
      count: Number(item.count),
    }));

    // Group used claims by day (coupon usage)
    const couponUsageOverTimeRaw = await prisma.$queryRaw<
      { date: string; count: bigint }[]
    >`
      SELECT DATE("createdAt") as date, COUNT(*) as count
      FROM "Claim"
      WHERE used = true
      GROUP BY DATE("createdAt")
      ORDER BY DATE("createdAt") ASC
    `;
    const couponUsageOverTime = couponUsageOverTimeRaw.map((item: { date: string; count: bigint }) => ({
      date: item.date,
      count: Number(item.count),
    }));

    const metrics = {
      totalClaims,
      usedClaims,
      unusedClaims,
      totalCoupons,
      activeCoupons,
      inactiveCoupons,
      claimsOverTime,
      couponUsageOverTime,
    };

    return NextResponse.json(metrics, { status: 200 });
  } catch (error) {
    console.error("Error fetching dashboard metrics", error);
    return NextResponse.json(
      { message: "Error fetching dashboard metrics" },
      { status: 500 }
    );
  }
}
