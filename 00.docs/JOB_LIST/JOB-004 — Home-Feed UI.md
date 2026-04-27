JOB-004 — Home / Feed UI
Context:
Màn hình chính của Readkeeper. Người dùng xem danh sách bài, filter và search.
Design: Warm & Cozy — màu kem/nâu, font Lora + Inter.
Task:
Tạo /app/(app)/page.tsx với các thành phần:

SearchBar — input full-width, debounce 300ms trước khi gọi API
SourceTabs — [Tất cả] [Facebook] [Substack] [Khác] — active state rõ ràng
TagFilter — dropdown chọn tag, multi-select
ArticleList — grid 1 cột, mỗi ArticleCard gồm:

Thumbnail (nếu có) — 80x80px, object-cover, rounded
Title — Lora, 18px, tối đa 2 dòng
Meta — source · author · thời gian lưu (Inter sm, muted)
Tags — pill list
Badge "Chưa đọc" nếu is_read = false


EmptyState — icon 📚 + text + nút hướng dẫn
Pagination — Prev / Next + số trang

Design tokens cần dùng:
Background: #FAF7F2
Surface/Card: #F2EDE4
Border: #E2D9CC
Text Primary: #2C2420
Text Muted: #7A6A5E
Accent: #8B6F47
Tag bg: #EDE0CE
Input: JOB-003 hoàn thành (API routes)
Output:

/app/(app)/page.tsx render đúng danh sách từ API
Filter và search hoạt động
Responsive đúng trên 375px

Constraints:

Không dùng UI library — tự viết Tailwind classes
Dùng màu đúng design system — không dùng màu Tailwind mặc định (blue, gray...)
Client component dùng 'use client' — server component fetch data trực tiếp