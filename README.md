# Readkeeper

Private web app to save and read articles from Facebook and Substack.

## Stack

- Next.js 16 (App Router) + TypeScript
- Supabase (Postgres + Auth)
- Tailwind CSS v4
- Deployed on Vercel

## Setup

1. **Clone & install**
   ```bash
   npm install
   ```

2. **Create `.env.local`** (copy the template below — never commit this file):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
   ```
   Get these values from your Supabase project → Settings → API.

3. **Run locally**
   ```bash
   npm run dev
   ```

4. **Deploy to Vercel**
   - Connect the GitHub repo to a new Vercel project
   - Add the three env vars above in Vercel → Settings → Environment Variables
   - Every push to `main` auto-deploys

## Directory Structure

```
app/
  api/save          POST  — save article from Chrome extension
  api/articles      GET   — list/filter/search articles
  api/articles/[id] GET/DELETE — single article
  api/tags          POST  — create/assign tag
  (auth)/login      Magic Link login page
  (app)/            Home feed + Article reading view
components/         Shared UI components
lib/supabase.ts     Supabase client
extension/          Chrome Extension (Manifest V3)
```
