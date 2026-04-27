JOB-001 — Setup Project
Context:
Readkeeper là web app private để lưu bài viết hay từ Facebook/Substack.
Tech stack: Next.js 14 (App Router) + Supabase + Tailwind CSS. Deploy trên Vercel.
Task:

Khởi tạo Next.js 14 project với App Router (npx create-next-app@latest)
Cài dependencies: @supabase/supabase-js, @supabase/ssr, tailwindcss
Cài Google Fonts: Lora (serif) + Inter (sans) trong layout.tsx
Tạo file .env.local với placeholder:

   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=

Tạo cấu trúc thư mục:

   /app
     /api
       /save
       /articles
       /tags
     /(auth)
       /login
     /(app)
       /page.tsx        ← Home
       /article/[id]
   /components
   /lib
     /supabase.ts
   /extension           ← Chrome extension (folder riêng)

Deploy lên Vercel, đảm bảo build pass

Input: Không có
Output:

Repo GitHub với cấu trúc thư mục đúng
Vercel project đã connect, build pass
File README.md ghi rõ cách setup env

Constraints:

Next.js 14 App Router — không dùng Pages Router
Tailwind CSS — không dùng CSS-in-JS hay styled-components
Không cài thêm UI library (shadcn, MUI...) — tự build component