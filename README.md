# AgencyOS

AgencyOS is a web-based business management platform for a boutique digital design agency. This foundation includes Supabase authentication, role-based access for owners, employees, and clients, plus a database schema for projects, tasks, messages, and attendance.

## Getting Started

1. Copy environment variables:

```bash
cp .env.local.example .env.local
```

2. Update `.env.local` with your Supabase project URL and keys.

3. Install dependencies:

```bash
npm install
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Supabase setup

- Create a Supabase project.
- Add the SQL in `supabase/schema.sql` to your Supabase database.
- Configure authentication in Supabase for email login.
- Use the `profiles` table to set `role` to `owner`, `employee`, or `client` for each user.

## Project structure

- `app/page.tsx` — AgencyOS landing page with role-aware CTA.
- `app/signin/page.tsx` — magic link sign-in page.
- `app/dashboard/owner/page.tsx` — owner dashboard with metrics.
- `lib/supabaseClient.ts` — browser Supabase client helper.
- `lib/supabaseServer.ts` — server Supabase client helper.
- `supabase/schema.sql` — database schema for profiles, projects, tasks, messages, and attendance.

## Notes

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are required for Supabase auth in the browser.
- `SUPABASE_SERVICE_ROLE_KEY` is recommended for server-side Supabase operations.
