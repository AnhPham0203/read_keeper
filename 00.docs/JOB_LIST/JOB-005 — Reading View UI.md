JOB-005 — Reading View UI
Context:
Màn hình đọc lại bài đã lưu. Tối ưu cho đọc — max-width 680px, font Lora.
Task:
Tạo /app/(app)/article/[id]/page.tsx với:

Toolbar — [← Quay lại] · [✓ Đã đọc / Chưa đọc] · [🗑 Xóa]

Nút Xóa: hiện confirm dialog trước khi xóa
Sau khi xóa: redirect về Home


ArticleHeader

Thumbnail full-width nếu có (max-height 300px, object-cover)
Title — Lora 2xl, nâu đậm
Meta — source · author · ngày lưu (Inter sm, muted)


TagRow

Hiển thị tag pills hiện có
Input "Thêm tag..." — gõ tên tag rồi Enter để thêm
Click X trên tag để xóa
Optimistic update — không cần reload


ArticleContent

Render nội dung text đã lưu
max-width 680px, centered
Inter base, line-height 1.8, color #2C2420


ExternalLink — "Xem bài gốc ↗" cuối trang, mở tab mới

Input: JOB-003 hoàn thành (API routes)
Output:

/app/(app)/article/[id]/page.tsx hiển thị đúng nội dung
Tag add/remove hoạt động không cần reload
Toggle đã đọc hoạt động

Constraints:

Optimistic update cho tag và is_read — UX phải mượt
Confirm dialog trước khi xóa — dùng window.confirm là đủ cho v1
Content không render HTML raw — chỉ render text thuần (security)