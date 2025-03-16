import React from "react";
import Link from "next/link";
// Adjust the import below according to your project structure for the Shadcn UI Button
import { Button } from "@/components/ui/button";
import Image from "next/image";

const DocumentationPage = () => {
  return (
    <div className="container mx-auto p-6">
      {/* Navigation Button */}
      <div className="flex justify-end mb-6">
        <Link href="/dashboard">
          <Button variant="default">Go to Dashboard</Button>
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-4">
        Coupon Management System with Admin Panel
      </h1>
      <p className="mb-6">
        A full-stack coupon management system with separate admin and user
        interfaces, built with Next.js, Clerk authentication, and PostgreSQL.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Features</h2>

        <h3 className="text-xl font-semibold mt-4 mb-2">Admin Panel</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <strong>Coupon Management</strong>
            <ul className="list-disc pl-6">
              <li>Create, Read, Update, Delete coupons</li>
              <li>Set total issuance and track usage</li>
              <li>Activate/deactivate coupons</li>
            </ul>
          </li>
          <li>
            <strong>Claims Overview</strong>
            <ul className="list-disc pl-6">
              <li>View all coupon claims</li>
              <li>Filter by used/unused status</li>
              <li>Detailed claim inspection</li>
            </ul>
          </li>
          <li>
            <strong>Dashboard Analytics</strong>
            <ul className="list-disc pl-6">
              <li>Metrics (total claims, coupons)</li>
              <li>Time-based claim charts</li>
              <li>Coupon usage trends</li>
            </ul>
          </li>
          <li>
            <strong>Admin Navigation</strong>
            <ul className="list-disc pl-6">
              <li>Protected routes</li>
              <li>Session management</li>
            </ul>
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-4 mb-2">User Panel</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <strong>Coupon Generation</strong>
            <ul className="list-disc pl-6">
              <li>Secure coupon claims</li>
              <li>Secret code protection</li>
              <li>Copy-to-clipboard functionality</li>
            </ul>
          </li>
          <li>
            <strong>Claim History</strong>
            <ul className="list-disc pl-6">
              <li>Personal usage tracking</li>
              <li>Secret code visibility toggle</li>
              <li>Status indicators</li>
            </ul>
          </li>
          <li>
            <strong>User Navigation</strong>
            <ul className="list-disc pl-6">
              <li>Guest/user session handling</li>
              <li>Secure sign-out</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Technologies</h2>
        <ul className="list-disc pl-6">
          <li>
            <strong>Framework</strong>: Next.js 14 (App Router)
          </li>
          <li>
            <strong>Authentication</strong>: Clerk
          </li>
          <li>
            <strong>Database</strong>: PostgreSQL + Prisma ORM
          </li>
          <li>
            <strong>Styling</strong>: Tailwind CSS + Shadcn UI
          </li>
          <li>
            <strong>Visualization</strong>: Chart.js
          </li>
          <li>
            <strong>Icons</strong>: Lucide React
          </li>
          <li>
            <strong>Utilities</strong>: Zod, Sonner (Toasts), date-fns
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Installation</h2>

        <h3 className="text-xl font-semibold mb-2">Prerequisites</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Node.js v18+</li>
          <li>PostgreSQL database</li>
          <li>Clerk account (for authentication)</li>
        </ul>

        <h3 className="text-xl font-semibold mb-2">Clone Repository</h3>
        <pre className="bg-gray-100 p-4 rounded mb-4">
          <code>{`git clone https://github.com/abdullah0408/round-robin-coupon-distribution.git
cd round-robin-coupon-distribution`}</code>
        </pre>

        <h3 className="text-xl font-semibold mb-2">Install Dependencies</h3>
        <pre className="bg-gray-100 p-4 rounded mb-4">
          <code>{`npm install`}</code>
        </pre>

        <h3 className="text-xl font-semibold mb-2">Environment Setup</h3>
        <pre className="bg-gray-100 p-4 rounded mb-4">
          <code>{`DATABASE_URL="postgresql://user:password@localhost:5432/coupon_db"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
CLERK_SECRET_KEY=your_clerk_secret
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/`}</code>
        </pre>

        <h3 className="text-xl font-semibold mb-2">Database Setup</h3>
        <pre className="bg-gray-100 p-4 rounded mb-4">
          <code>{`npx prisma generate
npx prisma migrate dev`}</code>
        </pre>

        <h3 className="text-xl font-semibold mb-2">Run Application</h3>
        <pre className="bg-gray-100 p-4 rounded mb-4">
          <code>{`npm run dev`}</code>
        </pre>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Project Structure</h2>
        <pre className="bg-gray-100 p-4 rounded mb-4">
          <code>{`├── src/
│   ├── app/
│   │   ├── (admin)/
│   │   │   ├── admin/
│   │   │   │   ├── _components/
│   │   │   │   │   └── Navbar.tsx
│   │   │   │   ├── api/
│   │   │   │   │   ├── create-coupon/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── dashboard-metrics/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── delete-coupon/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── fetch-claims/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── fetch-coupons/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   ├── update-coupon/
│   │   │   │   │   │   └── route.ts
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── claims/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── manage-coupons/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   │   └── [[...sign-in]]/
│   │   │   │       └── page.tsx
│   │   │   ├── sign-up/
│   │   │   │   └── [[...sign-up]]/
│   │   │   │       └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (user)/
│   │   │   ├── _components/
│   │   │   │   └── Navbar.tsx
│   │   │   ├── api/
│   │   │   │   ├── fetch-coupons/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── get-coupon/
│   │   │   │   │   └── route.ts
│   │   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── utils.ts
│   │   ├── middleware.ts
├── prisma/
│   └── schema.prisma
├── .env
├── .env.example
├── .gitignore
├── bun.lock
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json`}</code>
        </pre>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Configuration</h2>
        <h3 className="text-xl font-semibold mb-2">Database (Prisma)</h3>
        <pre className="bg-gray-100 p-4 rounded mb-4">
          <code>{`enum CouponStatus {
  Active
  Inactive
}

model Coupon {
  id          String       @id @default(cuid())
  code        String       @unique
  totalissued Int
  totalused   Int
  status      CouponStatus @default(Active)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  claims      Claim[]
}

model Claim {
  id        String  @id @default(cuid())
  secret    String  @unique
  userId    String?
  userEmail String?
  guestId   String?
  sessionId String
  ip        String
  used      Boolean @default(false)
  couponId  String
  coupon    Coupon  @relation(fields: [couponId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`}</code>
        </pre>

        <h3 className="text-xl font-semibold mb-2">Environment Variables</h3>
        <table className="min-w-full border border-gray-300 mb-4">
          <thead>
            <tr>
              <th className="border px-4 py-2">Variable</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Required</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">DATABASE_URL</td>
              <td className="border px-4 py-2">
                PostgreSQL connection URL
              </td>
              <td className="border px-4 py-2">Yes</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">
                NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
              </td>
              <td className="border px-4 py-2">
                Clerk frontend key
              </td>
              <td className="border px-4 py-2">Yes</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">CLERK_SECRET_KEY</td>
              <td className="border px-4 py-2">
                Clerk backend key
              </td>
              <td className="border px-4 py-2">Yes</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">API Endpoints</h2>
        <h3 className="text-xl font-semibold mb-2">Admin Endpoints</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <code>POST /admin/api/create-coupon</code> - Create coupon
          </li>
          <li>
            <code>GET /admin/api/fetch-coupons</code> - List all coupons
          </li>
          <li>
            <code>PUT /admin/api/update-coupon</code> - Update coupon
          </li>
          <li>
            <code>DELETE /admin/api/delete-coupon</code> - Delete coupon
          </li>
          <li>
            <code>GET /admin/api/fetch-claims</code> - Get all claims
          </li>
          <li>
            <code>GET /admin/api/dashboard-metrics</code> - Get analytics data
          </li>
        </ul>

        <h3 className="text-xl font-semibold mb-2">User Endpoints</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>
            <code>GET /api/get-coupon</code> - Generate new coupon
          </li>
          <li>
            <code>GET /api/fetch-coupons</code> - Get user&apos;s claim history
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Screenshots</h2>
        <div className="mb-4">
          <p className="mb-2 font-semibold">Admin Dashboard</p>
          <Image
          width={800}
          height={500}
            src="/admin-dashboard.png"
            alt="Admin Dashboard Preview"
            className="w-full rounded mb-4"
          />
          <p className="mb-2 font-semibold">Coupon Management</p>
          <Image
          width={800}
          height={500}
            src="/coupon-management.png"
            alt="Coupon Management Preview"
            className="w-full rounded mb-4"
          />
          <p className="mb-2 font-semibold">User Interface</p>
          <Image
          width={800}
          height={500}
            src="/user-interface.png"
            alt="User Interface Preview"
            className="w-full rounded mb-4"
          />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Contributing</h2>
        <ol className="list-decimal pl-6">
          <li>Fork the repository</li>
          <li>
            Create feature branch:
            <pre className="bg-gray-100 p-4 rounded mt-2">
              <code>{`git checkout -b feature/new-feature`}</code>
            </pre>
          </li>
          <li>Commit changes</li>
          <li>Push to branch</li>
          <li>Open Pull Request</li>
        </ol>
      </section>
    </div>
  );
};

export default DocumentationPage;
