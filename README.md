# Readkeeper

Bộ sưu tập bài đọc cá nhân — lưu bài từ Facebook và Substack.

## Stack

- **Next.js 16** App Router + TypeScript
- **Supabase** — Postgres + Auth (Magic Link)
- **Tailwind CSS v4**
- **Chrome Extension** — Manifest V3, Vanilla JS
- Deploy: **Vercel** (free tier)

---

## 1. Cài đặt local

```bash
git clone <repo-url>
cd read_keeper
npm install
```

Tạo `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

Lấy các giá trị trên tại: Supabase Dashboard → Settings → API.

```bash
npm run dev   # http://localhost:3000
```

---

## 2. Setup Supabase

### 2a. Chạy migration

Vào **Supabase Dashboard → SQL Editor**, paste và chạy toàn bộ nội dung file:

```
supabase/migrations/20260427000000_initial_schema.sql
```

### 2b. Cấu hình Auth

Vào **Authentication → Providers**:
- Tắt tất cả provider, chỉ giữ **Email**
- Bật **Magic Link** (tắt password)

Vào **Authentication → URL Configuration**:
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: thêm `https://your-app.vercel.app/auth/callback`

---

## 3. Deploy lên Vercel

1. Push code lên GitHub
2. Vào [vercel.com](https://vercel.com) → **Add New Project** → import repo
3. Thêm 3 biến môi trường trong **Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy → Vercel tự build và publish

---

## 4. Cài Chrome Extension

1. Mở `chrome://extensions`
2. Bật **Developer mode** (góc trên phải)
3. Bấm **Load unpacked** → chọn thư mục `extension/`
4. Icon Readkeeper xuất hiện trên toolbar

### Cấu hình extension lần đầu

Bấm icon → màn hình Settings hiện ra:

| Field | Giá trị |
|---|---|
| **API URL** | `https://your-app.vercel.app` |
| **Auth Token** | access token từ session (xem bên dưới) |

### Lấy Auth Token

1. Đăng nhập tại `https://your-app.vercel.app`
2. Mở DevTools (F12) → **Application → Local Storage**
3. Tìm key có dạng `sb-<ref>-auth-token`
4. Copy giá trị của field `access_token` bên trong
5. Paste vào ô **Auth Token** của extension

> Token có thời hạn ~1 giờ. Khi hết hạn, lặp lại bước trên để lấy token mới.

---

## 5. Cách dùng

1. Mở bài viết trên Facebook hoặc Substack
2. Bấm icon Readkeeper trên toolbar
3. Kiểm tra/sửa tiêu đề, thêm tags (Enter để thêm)
4. Bấm **💾 Lưu bài này**
5. Vào `https://your-app.vercel.app` để đọc lại

---

## Cấu trúc thư mục

```
app/
  api/          ← 6 API routes (save, articles, tags, auth)
  (auth)/login  ← Magic Link login page
  (app)/        ← Home feed + Reading view
  auth/callback ← OAuth callback handler
components/     ← Shared UI components
lib/            ← Supabase clients, types, format utils
extension/      ← Chrome Extension (Manifest V3)
supabase/
  migrations/   ← SQL schema
```
