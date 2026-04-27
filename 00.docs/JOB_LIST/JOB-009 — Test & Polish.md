JOB-009 — Test & Polish
Context:
JOB cuối — chạy toàn bộ DoD checklist trong CONTRACT.md, fix tất cả lỗi tìm thấy.
Task:
1. Chạy từng mục DoD — tick hoặc ghi lỗi
Extension:

 Cài extension vào Chrome → icon hiện trên toolbar
 Mở bài Facebook → popup hiện đúng title
 Mở bài Substack → popup hiện đúng title
 Bấm Save → toast "✅ Đã lưu" trong 3 giây
 Lưu bài đã có → toast "⚠️ Đã có trong thư viện"
 Thêm tag → lưu đúng vào DB

Home / Feed:

 Danh sách hiện đúng, mới nhất lên đầu
 Filter source hoạt động
 Filter tag hoạt động
 Search keyword hoạt động
 Empty state hiện khi không có bài

Reading View:

 Nội dung hiện đầy đủ
 Toggle đã đọc hoạt động
 Thêm tag không reload
 Xóa tag không reload
 Xóa bài → confirm → về Home
 Link gốc mở tab mới

Auth:

 Magic Link nhận được trong email
 Click link → vào Home
 Session giữ sau 1 giờ

Performance:

 Home load < 3 giây
 Search < 1 giây

Responsive:

 Home đúng trên 375px
 Reading View đúng trên mobile

2. Fix tất cả lỗi tìm thấy
3. Polish checklist

 Không có console.error khi dùng bình thường
 Tất cả loading state có spinner hoặc skeleton
 Tất cả error state có message rõ ràng
 Không còn hardcode URL, magic string
 README cập nhật hướng dẫn deploy đầy đủ

Input: JOB-001 đến JOB-008 hoàn thành
Output:

GATE_CHECKLIST.md với tất cả ô đã tick [x]
Không còn bug nào ở mức P0 hoặc P1

Constraints:

Không thêm feature mới trong JOB này — chỉ fix và polish
Nếu phát hiện bug lớn cần thay đổi architecture → báo Thầu trước khi fix


Dependency Map
JOB-001 (Setup)
    │
    ├──► JOB-002 (DB + Auth Setup)
    │         │
    │         ├──► JOB-003 (API Routes)
    │         │         │
    │         │         ├──► JOB-004 (Home UI)
    │         │         │         │
    │         │         └──► JOB-005 (Reading UI)
    │         │                   │
    │         └──► JOB-008 (Auth Flow)
    │                             │
    └──► JOB-006 (Extension UI)   │
              │                   │
              └──► JOB-007 (Content Script)
                             │
                             └──────────────► JOB-009 (Test & Polish)
Gate Checklist

 Tất cả 5 core features đều có JOB tương ứng
 Không có JOB nào output > 300 dòng code (đã tách đủ nhỏ)
 JOB cuối là Test & Polish (JOB-009)
 Dependency map rõ ràng
 Chủ đầu tư đã duyệt JOB_LIST.md