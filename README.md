# 9point75 Woodworks

Next.js marketing site and owner admin foundation for 9point75 Woodworks.

## Stack
- Next.js App Router
- Vercel deployment
- Supabase-ready auth, storage, and lead management foundation

## Local Development
1. Install dependencies:
   - `npm install`
2. Copy environment variables:
   - Duplicate `.env.example` to `.env.local`
3. Add Supabase values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_EMAIL`
   - Optional email notifications: `RESEND_API_KEY`, `NOTIFICATION_FROM_EMAIL`, `NOTIFICATION_TO_EMAIL`
4. Start development:
   - `npm run dev`

## Supabase Setup
- Create a Supabase project in your own account.
- In Supabase Auth, create one email/password user for the business owner.
- Set `ADMIN_EMAIL` to that exact email address.
- Run the SQL in `supabase/schema.sql`.
- Add the same environment variables in Vercel before enabling production submissions.
- If you want new lead emails, set up a Resend sender and add the optional notification env vars.

## Current Routes
- `/`
- `/gallery`
- `/about`
- `/contact`
- `/admin`
- `/sign-in`

## Deployment
- Push `main` to GitHub
- Import the repo into Vercel
- Add Supabase environment variables in Vercel project settings
- Connect the Cloudflare domain after the first production deploy
