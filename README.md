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
3. Start development:
   - `npm run dev`

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
