# Readkeeper — Private Reading Collection

Private web app to save and read articles from Facebook and Substack.
Single user. No multi-tenancy needed.

---

## Tech Stack

- **Frontend/Backend**: Next.js 14 App Router — deploy on Vercel free tier
- **Database**: Supabase (Postgres + Auth)
- **Styling**: Tailwind CSS — no UI libraries (shadcn, MUI, etc.)
- **Extension**: Chrome Extension Manifest V3 — Vanilla JS
- **Fonts**: Lora (serif, headings) + Inter (sans, body) via Google Fonts

## Architecture

```
Chrome Extension → POST /api/save → Next.js (Vercel) → Supabase (Postgres)
```

API Routes:
- `POST /api/save` — receive article from extension
- `GET /api/articles` — list + filter + search (full-text via tsvector)
- `GET /api/articles/[id]` — single article + tags
- `DELETE /api/articles/[id]` — delete article
- `POST /api/tags` — create/assign tag

Auth: Supabase Magic Link (email only, single user)

## Directory Structure

```
/app
  /api/save · /api/articles · /api/tags
  /(auth)/login
  /(app)/page.tsx (Home) · /article/[id]
/components
/lib/supabase.ts
/extension   ← Chrome extension (separate folder)
```

## Database Schema

**articles**: id (uuid PK), url (unique), title, content, excerpt, thumbnail_url, source ('facebook'/'substack'/'other'), author, saved_at, is_read (bool), search_vector (tsvector)

**tags**: id (uuid PK), name (unique), color (hex)

**article_tags**: article_id FK, tag_id FK (many-to-many)

## Design System

Warm & Cozy — calm, focused, library feel. Never add dark mode (v2 only).

Colors: Background `#FAF7F2`, Surface `#F2EDE4`, Accent `#8B6F47`, Text `#2C2420`

Components: no external UI libs — build from scratch using Tailwind.

## Scope Constraints (V1)

**IN**: Chrome extension, Home feed (filter/search/pagination), Reading View, Magic Link auth, 5 API routes.

**OUT**: bulk import, public sharing, mobile app, Firefox/Safari extension, AI summary, notifications, dark mode.

## Jobs

See `/JOB_LIST/` for per-session task specs. Current jobs:

| Job | Description | Status |
|-----|-------------|--------|
| JOB-001 | Setup project (Next.js + Supabase + Vercel deploy) | Defined |
| JOB-002 | Database schema + Supabase Auth | Pending |
| JOB-003 | API Routes | Pending |
| JOB-004 | Home / Feed UI | Pending |
| JOB-005 | Reading View UI | Pending |
| JOB-006 | Chrome Extension — popup UI | Pending |
| JOB-007 | Chrome Extension — content script | Pending |
| JOB-008 | Auth flow (Magic Link + session guard) | Pending |
| JOB-009 | Test & Polish | Pending |

## Performance Targets

- Save via extension < 3 seconds
- Search results < 1 second
- Home first load < 3 seconds (Vercel cold start acceptable)

## Env Vars

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```
