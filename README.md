# Coupon Management System with Admin Panel

A full-stack coupon management system with separate admin and user interfaces, built with Next.js, Clerk authentication, and PostgreSQL.

## Features

### Admin Panel
- **Coupon Management**
  - Create, Read, Update, Delete coupons
  - Set total issuance and track usage
  - Activate/deactivate coupons
- **Claims Overview**
  - View all coupon claims
  - Filter by used/unused status
  - Detailed claim inspection
- **Dashboard Analytics**
  - Metrics (total claims, coupons)
  - Time-based claim charts
  - Coupon usage trends
- **Admin Navigation**
  - Protected routes
  - Session management

### User Panel
- **Coupon Generation**
  - Secure coupon claims
  - Secret code protection
  - Copy-to-clipboard functionality
- **Claim History**
  - Personal usage tracking
  - Secret code visibility toggle
  - Status indicators
- **User Navigation**
  - Guest/user session handling
  - Secure sign-out

## Technologies

- **Framework**: Next.js 14 (App Router)
- **Authentication**: Clerk
- **Database**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS + Shadcn UI
- **Visualization**: Chart.js
- **Icons**: Lucide React
- **Utilities**: Zod, Sonner (Toasts), date-fns

## Installation

1. **Prerequisites**
   - Node.js v18+
   - PostgreSQL database
   - Clerk account (for authentication)

2. **Clone Repository**
   ```bash
   git clone https://github.com/abdullah0408/round-robin-coupon-distribution.git
   cd round-robin-coupon-distribution
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Environment Setup**
   Create `.env` file:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/coupon_db"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
   CLERK_SECRET_KEY=your_clerk_secret
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
   NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
   ```

5. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

6. **Run Application**
   ```bash
   npm run dev
   ```

## Project Structure

```
├── src/
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
└── tsconfig.json
```

## Configuration

### Database (Prisma)
Example schema:
```prisma
enum CouponStatus {
  Active
  Inactive
}

model Coupon {
  id          String       @id @default(cuid())
  code        String       @unique
  totalissued Int
  totalused   Int
  status      CouponStatus @default(Active)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  claims Claim[]
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
  couponId String
  coupon   Coupon @relation(fields: [couponId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Environment Variables
| Variable                          | Description                     | Required |
|-----------------------------------|---------------------------------|----------|
| DATABASE_URL                      | PostgreSQL connection URL       | Yes      |
| NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY | Clerk frontend key              | Yes      |
| CLERK_SECRET_KEY                  | Clerk backend key               | Yes      |

## API Endpoints

### Admin Endpoints
- `POST /admin/api/create-coupon` - Create coupon
- `GET /admin/api/fetch-coupons` - List all coupons
- `PUT /admin/api/update-coupon` - Update coupon
- `DELETE /admin/api/delete-coupon` - Delete coupon
- `GET /admin/api/fetch-claims` - Get all claims
- `GET /admin/api/dashboard-metrics` - Get analytics data

### User Endpoints
- `GET /api/get-coupon` - Generate new coupon
- `GET /api/fetch-coupons` - Get user's claim history

## Screenshots

*Admin Dashboard*
![Admin Dashboard Preview](screenshots/admin-dashboard.png)

*Coupon Management*
![Coupon Management Preview](screenshots/coupon-management.png)

*User Interface*
![User Interface Preview](screenshots/user-interface.png)

## Contributing

1. Fork the repository
2. Create feature branch:
   ```bash
   git checkout -b feature/new-feature
   ```
3. Commit changes
4. Push to branch
5. Open Pull Request