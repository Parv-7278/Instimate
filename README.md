# Institution Hub — Universal Multi-Tenant Institution Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-teal?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-emerald?logo=supabase)](https://supabase.com/)
[![Razorpay](https://img.shields.io/badge/Payments-Razorpay%20UPI%20%26%20Cards-blue?logo=razorpay)](https://razorpay.com/)

**Institution Hub** is an enterprise-grade, multi-tenant SaaS platform that enables **10 distinct institution types** — schools, colleges, universities, coaching centres, corporate offices, government departments, hospitals, NGOs, public-sector units, and training centres — to independently register, receive verification authorization, and manage their organization through tailored operational dashboards.

---

## 📋 Table of Contents

- [Technology Stack](#technology-stack)
- [Architecture Overview](#architecture-overview)
- [Key Features](#key-features)
- [Prerequisites](#prerequisites)
- [Installation & Local Setup](#installation--local-setup)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Development Commands](#development-commands)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Security Notes](#security-notes)
- [Deployment](#deployment)

---

## Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16.4 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **UI** | React 19.3, Tailwind CSS v4 |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Database** | Supabase (PostgreSQL + Auth + RLS) |
| **State** | React Context + localStorage persistence |
| **Payments** | Razorpay (UPI, NetBanking, Cards, HMAC SHA256) |
| **Email** | Resend |
| **Runtime** | Node.js v18+ |

---

## Architecture Overview

```
src/
├── app/
│   ├── api/razorpay/        # Server-side payment order creation & HMAC verification
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx             # Root view coordinator (gateway → superadmin → workspace)
├── components/
│   ├── gateway/             # Universal Institution Entry & Registration
│   ├── superadmin/          # Platform Verification & Governance Dashboard
│   ├── dashboards/          # Corporate & Government type-specific dashboards
│   ├── dashboard/           # Academic overview & role-based views
│   ├── students/            # Admissions, directory, digital ID card
│   ├── attendance/          # Roll-call register, bulk marking, CSV export
│   ├── timetable/           # Conflict-detection scheduling grid
│   ├── finance/             # Razorpay checkout, invoices, receipts
│   ├── exams/               # Mark entry, GPA, printable report cards
│   ├── academics/           # Classrooms & Faculty modules
│   ├── assignments/         # Homework portal, submission, grading
│   ├── announcements/       # Digital notice board
│   ├── modules/             # Leave management, Library
│   ├── integrations/        # Third-party API configuration panel
│   ├── settings/            # Institution settings module
│   ├── landing/             # Public SaaS marketing page
│   └── layout/              # Navbar, Sidebar, GlobalSearchModal
├── lib/
│   ├── config.ts            # Centralized environment variable configuration
│   ├── storeContext.tsx     # Universal reactive state (Context API)
│   ├── seedData.ts          # Demo seed data for all institution types
│   ├── supabase.ts          # Supabase client initialization
│   ├── razorpay.ts          # Razorpay SDK loader helper
│   └── utils.ts             # Shared utilities (currency, grading)
├── types/
│   └── index.ts             # All TypeScript interfaces and type definitions
supabase/
└── migrations/              # Complete PostgreSQL schema with RLS policies
tests/
└── multi_tenant_test.ts     # Automated multi-tenant isolation & security tests
```

---

## Key Features

### 🏛️ Universal Institution Gateway (First Screen)
- **Institution Registration** — Multi-step wizard with conditional regulatory fields per institution type (CBSE/AICTE affiliation, Corporate CIN/EIN, Government Ministry code, Hospital trust license, NGO 80G/12A)
- **Sign In to Institution** — Login by institution code or slug, with status enforcement (only `Active` approved tenants can sign in)
- **Member Login** — For students, faculty, employees, and officers
- **Super Admin Governance Button** — Platform-level control access directly from the gateway header
- **Live Multi-Tenant Directory** — Searchable directory of all registered organizations with verification status

### 🛡️ Super Admin Governance
- Review and approve/reject institution registration applications
- Audit notes recorded for every verification action
- Status lifecycle: `Pending Verification` → `Under Review` → `Active` | `Rejected` | `Suspended`

### 🏢 Multi-Tenant Workspaces

**Academic** (School, College, University, Coaching):
- KPI dashboard with attendance donut, fee collection progress, exam performance charts
- Student admissions with printable digital ID cards and CSV import/export
- Daily attendance roll-call with bulk marking and low-attendance alerts
- Conflict-free timetable (room + faculty double-booking detection)
- Exam mark entry matrix, GPA computation, official report card generation
- Razorpay online payments (UPI, Cards, NetBanking) with HMAC SHA256 server verification
- Assignments portal, announcement board, library, leave management

**Corporate Office / Public Sector**:
- Clock-in/clock-out with hybrid work mode (Office, Remote, Client Site)
- Overtime detection (>8 hours), shift duration tracking
- Employee directory with department, designation, employment type
- Payroll engine: Basic + Allowances, PF + Tax deductions, net pay, printable payslips

**Government Office / Department**:
- Official circular/gazette publishing (Public Notice, Departmental, Confidential, Urgent Order)
- E-Office file tracking with desk routing and immutable movement audit trail

### 👥 Role-Based Access Control
13 distinct roles: `super_admin`, `institution_owner`, `institution_admin`, `principal`, `faculty`, `student`, `parent`, `accountant`, `hr_staff`, `corporate_employee`, `govt_officer`, `librarian`, `auditor`

### 🧭 EventRoute — Event Navigation & Smart Itinerary
- **AI-Powered Itinerary Planner**:
  - 4-step onboarding wizard: Interest tracks (Coding, Gaming, Music, Entrepreneurship, Workshops, Security, Design, Robotics), experience level, pacing (Relaxed, Balanced, Intensive), and daily availability.
  - Conflict-free schedule generation engine with zero session collisions, transit walking buffer computation, and automated meal/networking breaks.
  - Export to standard calendar `.ICS` format or save to local profile.
- **Interactive Venue Map & Crowd Density Heatmap**:
  - SVG architectural floor plan covering 8 major halls, arenas, food court, and registration concourse.
  - Live crowd density layer (Heatmap overlay) with radial gradients & pulsing indicators for Low (<45%), Moderate (45-79%), and Congested (>80%) foot-traffic.
  - Real-time simulation toolbar to fluctuate foot-traffic telemetry.
- **Indoor Pathfinding (A* & Dijkstra)**:
  - Client-side and server-side shortest pathfinder between any two rooms/booths.
  - Dynamic "Avoid Congested Corridors" mode with path weighting penalties.
  - Turn-by-turn guidance with step-by-step instructions, walking distance in meters, and estimated walk duration in minutes.
- **Proactive Smart Notifications / Alerts Drawer**:
  - Floating toast alert and slide-over notification drawer with live countdowns.
  - Dynamic departure warnings: e.g. "Starts in 12 mins • 3 mins walk from your location • Start heading over!".
  - Interactive "Simulate My Current Location" switcher with automatic walk-time recalculation.
  - One-click "Navigate Now" quick action that directly plots the path on the interactive floor plan.
- **RESTful API Routes**:
  - `GET /api/eventroute/events` — Query event sessions and venue halls
  - `GET/POST /api/eventroute/preferences` — Persist user onboarding preferences
  - `POST /api/eventroute/itinerary` — Server-side AI schedule generation
  - `GET/POST /api/eventroute/density` — Real-time crowd density state & telemetry simulation
  - `POST /api/eventroute/route` — Shortest indoor pathfinding calculations

---

## Prerequisites

- **Node.js** v18 or v20+ (tested on v24)
- **npm** or **pnpm**
- A [Supabase](https://supabase.com/) account (optional — app works locally without it)
- A [Razorpay](https://razorpay.com/) account for live payment testing (optional — sandbox mode works without keys)

---

## Installation & Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/Shivangi-gupta-22/Attend.git
cd Attend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Then open .env.local and fill in your actual credentials (see Environment Variables section)

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the **Universal Institution Gateway** is the first screen.

> **No external services required for local development.** The platform includes a complete reactive in-memory store with seed data. You can explore all dashboards, registration flows, and workspaces immediately without configuring Supabase or Razorpay.

---

## Environment Variables

Copy `.env.example` to `.env.local` and replace each placeholder with your actual values:

```bash
cp .env.example .env.local
```

| Variable | Required | Purpose |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | Supabase project URL for live database |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | Supabase anonymous key (client-safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Supabase service role (server-only, never expose to browser) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Optional | Razorpay public key ID (safe for frontend) |
| `RAZORPAY_KEY_ID` | Optional | Razorpay key ID (server-side) |
| `RAZORPAY_KEY_SECRET` | Optional | Razorpay key secret (server-only) |
| `RAZORPAY_WEBHOOK_SECRET` | Optional | Razorpay webhook HMAC secret |
| `RESEND_API_KEY` | Optional | Resend email API key |
| `GOOGLE_CLIENT_ID` | Optional | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth Client Secret (server-only) |
| `WHATSAPP_ACCESS_TOKEN` | Optional | Meta Graph API access token (server-only) |

> ⚠️ **IMPORTANT**: `.env.local` is excluded from Git by `.gitignore`. Never commit it. Never put real credentials in `.env.example` or source code.

---

## Database Setup

A complete PostgreSQL schema with foreign keys, indexes, and Row-Level Security (RLS) policies is provided at:

```
supabase/migrations/20240102000000_full_supabase_backend.sql
supabase/seed.sql
```

To apply to your Supabase project:

1. Open your [Supabase Dashboard](https://supabase.com/dashboard) → **SQL Editor**
2. Paste the contents of `supabase/migrations/20240102000000_full_supabase_backend.sql` and click **Run**
3. (Optional) Paste `supabase/seed.sql` and click **Run** to load initial sample data
4. Add your Supabase project URL, Anon Key, and Service Role Key to `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   ```
5. Check backend health at `/api/supabase/health` — the platform will automatically detect live PostgreSQL connection and show the **Supabase Live** badge in the navbar.


---

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Type-check and build production bundle
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint

# Run multi-tenant isolation & security tests
npm test
```

---

## Testing

The automated test suite covers:
- All 10 institution type definitions
- Institution registration status enforcement (`Pending Verification` on creation)
- Super Admin approval lifecycle
- Cross-tenant data isolation (School vs Corporate vs Government)
- Corporate clock-in duration & overtime calculation
- Monthly payroll gross/net pay computation
- Government e-office file desk routing with audit trail
- Timetable room collision and faculty double-booking detection
- Razorpay HMAC SHA256 payment signature verification and forgery rejection
- All 13 role-based access control entries

```bash
npm test
```

Expected output: **20 ✅ PASSED** assertions across all test categories.

---

## Project Structure

See the [Architecture Overview](#architecture-overview) section for the full annotated tree.

Key directories to explore first:
- `src/components/gateway/InstitutionGateway.tsx` — First-screen Gateway entry
- `src/components/superadmin/SuperAdminDashboard.tsx` — Platform governance
- `src/components/dashboards/` — Corporate and Government workspaces
- `src/lib/config.ts` — Centralized environment variable configuration
- `src/lib/storeContext.tsx` — Full application state management
- `tests/multi_tenant_test.ts` — Automated test suite

---

## Security Notes

> 🔐 **Never commit real credentials, API keys, secrets, or tokens to this repository.**

- All environment-specific secrets are managed through environment variables only
- `.env`, `.env.local`, and all `.env.*.local` files are excluded from Git via `.gitignore`
- `.env.example` is tracked in Git but contains **only safe placeholder values**
- Server-side secrets (`RAZORPAY_KEY_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_CLIENT_SECRET`, `WHATSAPP_ACCESS_TOKEN`) are isolated to server-only config and never exposed through browser bundles or API responses
- The `src/lib/config.ts` module enforces the public/server boundary
- Razorpay payment signatures are verified server-side using HMAC SHA256 (`/api/razorpay/verify`)
- Missing configuration produces safe, descriptive error messages — no secrets are leaked in error output

If a real credential was accidentally committed to any repository, **revoke and rotate it immediately** — removing it from the latest commit is not sufficient.

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Set all environment variables in the Vercel project dashboard under **Settings → Environment Variables** before deploying. Do not use the `vercel.json` file to store secrets.

### Self-Hosted / Docker

```bash
npm run build
npm run start
```

Set environment variables via your hosting platform's secret manager or `.env.production` (which is excluded from Git).

---

## Demo Personas

| Role | Name | Email |
| :--- | :--- | :--- |
| Super Admin | Alexander Wright | `superadmin@institutionhub.io` |
| Institution Admin | Dr. Michael Chen | `admin@apexacademy.edu` |
| Faculty | Prof. Ananya Sharma | `ananya.sharma@apexacademy.edu` |
| Student | Aarav Patel | `aarav.patel@apexacademy.edu` |
| Parent | Rajesh Patel | `rajesh.patel@gmail.com` |
| Accountant | Sanjay Mehra | `accounts@apexacademy.edu` |
| Principal | Dr. Katherine Howard | `principal@apexacademy.edu` |
| HR Staff | Pooja Verma | `hr@apexacademy.edu` |

Use the **Role Switcher** in the top navigation bar to switch between personas without credentials.
