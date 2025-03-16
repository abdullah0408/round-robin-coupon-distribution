import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    return new PrismaClient();
}

const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Helper to generate a random date between two dates
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Helper to generate a random IPv4 address
function randomIP() {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.')
}

async function main() {
  // Create some coupons first (here, we create 10 coupons to randomly assign to claims)
  const coupons = []
  for (let i = 0; i < 10; i++) {
    const coupon = await prisma.coupon.create({
      data: {
        code: `COUPON${i}`,
        totalissued: Math.floor(Math.random() * 1000),
        totalused: Math.floor(Math.random() * 1000),
        // Optionally, you can randomize status too:
        status: Math.random() < 0.8 ? 'Active' : 'Inactive'
      }
    })
    coupons.push(coupon)
  }

  // Define the date range: last 60 days before 16 March 2025
  const today = new Date('2025-03-16')
  const sixtyDaysAgo = new Date(today)
  sixtyDaysAgo.setDate(today.getDate() - 60)

  // Create 1000 claims one by one
  for (let i = 0; i < 1000; i++) {
    // Random createdAt between sixtyDaysAgo and today
    const createdAt = randomDate(sixtyDaysAgo, today)

    // Randomly decide whether this claim is for a registered user (50% chance)
    const isUserClaim = Math.random() < 0.5
    let userId = null
    let userEmail = null
    let guestId = null

    if (isUserClaim) {
      // Simulate user claim: set userId and email, leave guestId null
      userId = `user_${Math.floor(Math.random() * 10000)}`
      userEmail = `${userId}@example.com`
    } else {
      // Simulate guest claim: set guestId, leave userId and userEmail null
      guestId = `guest_${Math.floor(Math.random() * 10000)}`
    }

    // Select a random coupon from the created ones
    const randomCoupon = coupons[Math.floor(Math.random() * coupons.length)]

    // Create a new claim record with random data
    await prisma.claim.create({
      data: {
        secret: `secret_${i}_${Math.random().toString(36).substring(2, 10)}`,
        userId,       // will be null if not a user claim
        userEmail,    // will be null if not a user claim
        guestId,      // will be null if it is a user claim
        sessionId: `session_${Math.floor(Math.random() * 100000)}`,
        ip: randomIP(),
        used: Math.random() < 0.5,
        couponId: randomCoupon.id,
        createdAt,    // setting createdAt to the random date within the last 60 days
      }
    })
    console.log(`Created claim ${i + 1}/1000`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
