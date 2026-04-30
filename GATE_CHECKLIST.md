# Gate Checklist — Readkeeper V1

## Extension

- [x] Cài extension vào Chrome → icon hiện trên toolbar
- [x] Mở bài Facebook → popup hiện đúng title (og:title + 8 fallback selector)
- [x] Mở bài Substack → popup hiện đúng title (h1.post-title + fallback)
- [x] Bấm Save → toast "✅ Đã lưu" → popup tự đóng sau 1.5 giây
- [x] Lưu bài đã có → toast "⚠️ Đã có trong thư viện"
- [x] Thêm tag → lưu đúng vào DB (POST /api/tags)

## Home / Feed

- [x] Danh sách hiện đúng, mới nhất lên đầu (`ORDER BY saved_at DESC`)
- [x] Filter source hoạt động (SourceTabs → `?source=`)
- [x] Filter tag hoạt động (TagFilter dropdown → `?tag=`)
- [x] Search keyword hoạt động (full-text via tsvector `simple`, debounce 300ms)
- [x] Empty state hiện khi không có bài (EmptyState component)
- [x] Loading skeleton hiện khi đang tải (`loading.tsx`)
- [x] Error boundary hiện khi lỗi DB (`error.tsx`)

## Reading View

- [x] Nội dung hiện đầy đủ (plain text, split bởi `\n\n`)
- [x] Toggle đã đọc hoạt động (PATCH /api/articles/[id], optimistic)
- [x] Thêm tag không reload (optimistic, temp ID → real ID)
- [x] Xóa tag không reload (optimistic remove)
- [x] Xóa bài → confirm dialog → về Home
- [x] Link gốc mở tab mới (`target="_blank" rel="noopener"`)

## Auth

- [x] Magic Link flow: nhập email → `signInWithOtp` → email gửi đi
- [x] Click link → `/auth/callback` exchange code → session set → redirect `/`
- [x] Session persist: cookie-based via `@supabase/ssr`, refresh tự động qua proxy
- [x] Logout: `signOut()` → redirect `/login`
- [x] Unauthenticated → redirect `/login` (proxy session guard)

## Performance

- [x] Home load < 3 giây: server-rendered, không waterfall client fetch
- [x] Search < 1 giây: GIN index trên `search_vector`, query trực tiếp Supabase

## Responsive

- [x] Home đúng trên 375px: `max-w-2xl`, single column, full-width search/tabs
- [x] Reading View đúng trên mobile: `max-w-[680px]`, padding `px-4`

## Polish

- [x] Không có console.error khi dùng bình thường
- [x] Loading state: skeleton cards (Home), `disabled` + text (buttons, forms)
- [x] Error state: `error.tsx` với message + nút Thử lại; `not-found.tsx` cho 404
- [x] Không còn hardcode URL — API URL đọc từ `chrome.storage.sync`
- [x] README cập nhật: setup local, Supabase migration, Vercel deploy, extension config

## Code Quality

- [x] Tất cả API routes check auth (401 nếu chưa login)
- [x] CORS headers cho extension requests (`proxy.ts`)
- [x] Content script không access Supabase trực tiếp — chỉ qua API
- [x] Không dùng `dangerouslySetInnerHTML` — plain text only
- [x] Không dùng `eval()` trong extension
