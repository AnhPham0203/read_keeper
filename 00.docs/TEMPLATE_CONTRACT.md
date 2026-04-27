# TEMPLATE_CONTRACT.md
# Readkeeper — Private Reading Collection v1.0

---

## Scope IN — V1 sẽ build

```
1. Chrome Extension
   ✅ Bấm icon → popup 320px
   ✅ Auto-fill title từ trang đang đọc
   ✅ Detect source tự động (facebook / substack / other)
   ✅ Thêm tag trước khi lưu
   ✅ POST lên /api/save → toast thành công / thất bại

2. Web App — Home / Feed
   ✅ Danh sách bài đã lưu (thumbnail + title + meta + tags)
   ✅ Filter theo source (Facebook / Substack / Other / Tất cả)
   ✅ Filter theo tag
   ✅ Search full-text theo keyword
   ✅ Pagination (20 bài / trang)
   ✅ Empty state khi chưa có bài

3. Web App — Reading View
   ✅ Hiển thị nội dung đầy đủ đã lưu
   ✅ Thêm / xóa tag
   ✅ Toggle đã đọc / chưa đọc
   ✅ Xóa bài
   ✅ Link ra bài gốc

4. Auth
   ✅ Magic Link qua email (Supabase Auth)
   ✅ Session tự động — không cần login lại mỗi ngày

5. Backend / API
   ✅ POST /api/save
   ✅ GET  /api/articles (filter + search + pagination)
   ✅ GET  /api/articles/[id]
   ✅ DELETE /api/articles/[id]
   ✅ POST /api/tags
```

---

## Scope OUT — V1 KHÔNG build

```
❌ Import hàng loạt (bulk import từ Pocket, Instapaper...)
   → Lý do: quá phức tạp cho MVP, để v2

❌ Share bài ra public / tạo reading list công khai
   → Lý do: ngoài định nghĩa private collection v1

❌ Mobile app (iOS / Android native)
   → Lý do: web responsive đủ dùng cho v1

❌ Firefox / Safari extension
   → Lý do: Chrome/Edge Manifest V3 đủ cho v1

❌ AI summary / highlight tự động
   → Lý do: nice-to-have, để v2

❌ Notification / reminder đọc lại
   → Lý do: ngoài MVP

❌ Dark mode
   → Lý do: Warm & Cozy theme đã là identity, để v2
```

---

## Definition of Done (DoD)

> Mỗi điều kiện phải **test được thủ công** — không dùng từ mơ hồ.

### Extension
- [ ] Cài extension vào Chrome → icon hiện trên toolbar
- [ ] Mở 1 bài Facebook → bấm icon → popup hiện đúng title
- [ ] Mở 1 bài Substack → bấm icon → popup hiện đúng title
- [ ] Bấm Save → trong 3 giây → toast "✅ Đã lưu" hiện ra
- [ ] Bấm Save bài đã lưu rồi → toast "⚠️ Đã có trong thư viện"
- [ ] Thêm tag trong popup → tag lưu đúng vào DB

### Home / Feed
- [ ] Mở app → thấy danh sách bài đã lưu, mới nhất lên đầu
- [ ] Bấm [Facebook] → chỉ thấy bài từ Facebook
- [ ] Bấm [Substack] → chỉ thấy bài từ Substack
- [ ] Chọn tag "design" → chỉ thấy bài có tag đó
- [ ] Gõ keyword vào search → thấy bài có chứa keyword đó
- [ ] Chưa có bài nào → thấy empty state + hướng dẫn

### Reading View
- [ ] Click vào bài → thấy nội dung đầy đủ đã lưu
- [ ] Bấm "Đã đọc" → icon đổi trạng thái + lưu DB
- [ ] Thêm tag → tag hiện ngay, không cần reload
- [ ] Xóa tag → tag biến mất ngay
- [ ] Bấm Xóa bài → confirm dialog → xóa → về Home
- [ ] Bấm "Xem bài gốc" → mở tab mới đúng URL

### Auth
- [ ] Nhập email → nhận Magic Link trong email
- [ ] Click link → vào thẳng Home, không hỏi lại
- [ ] Đóng tab, mở lại sau 1 giờ → vẫn còn session

### Performance
- [ ] Home load lần đầu < 3 giây (Vercel cold start)
- [ ] Search ra kết quả < 1 giây sau khi gõ xong
- [ ] Không có console error khi dùng bình thường

### Responsive
- [ ] Home hiển thị đúng trên màn 375px (iPhone SE)
- [ ] Reading View đọc được trên mobile, không bị cắt chữ

---

## Timeline ước tính

| Job | Nội dung | Phụ thuộc |
|-----|----------|-----------|
| JOB-001 | Setup project (Next.js + Supabase + deploy Vercel) | — |
| JOB-002 | Database schema + Supabase Auth | JOB-001 |
| JOB-003 | API Routes (save / list / detail / delete / tags) | JOB-002 |
| JOB-004 | Home / Feed UI (list + filter + search) | JOB-003 |
| JOB-005 | Reading View UI | JOB-003 |
| JOB-006 | Chrome Extension — popup UI | JOB-001 |
| JOB-007 | Chrome Extension — content script (extract + POST) | JOB-006 |
| JOB-008 | Auth flow (Magic Link + session guard) | JOB-002 |
| JOB-009 | Test & Polish (empty states, error states, responsive) | JOB-001–008 |

**Tổng: 9 JOB — 9 phiên làm việc với Claude Code**

---

## Gate Checklist

- [x] Scope IN/OUT không mơ hồ — từng item cụ thể
- [x] DoD có thể test thủ công từng điểm
- [x] Timeline rõ — 9 JOB, 9 phiên
- [ ] Chủ đầu tư đã ký duyệt CONTRACT.md