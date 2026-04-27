JOB-003 — API Routes
Context:
Next.js API Routes xử lý toàn bộ CRUD. Extension và Web App đều gọi qua đây.
Task:
Tạo các API Route sau:
POST /api/save
Body: { url, title, content, excerpt, thumbnail_url, source, author, tags[] }
- Kiểm tra url đã tồn tại chưa → nếu có return { duplicate: true }
- Insert vào articles
- Nếu có tags[] → upsert vào tags, insert article_tags
- Return: { id, saved_at, duplicate: false }
GET /api/articles
Query: ?source=facebook&tag=design&q=keyword&page=1&limit=20
- Filter theo source nếu có
- Filter theo tag nếu có
- Full-text search nếu có q (dùng search_vector)
- Pagination: offset = (page-1) * limit
- Return: { articles: [...], total, page, totalPages }
- Mỗi article kèm tags[]
GET /api/articles/[id]
- Lấy article đầy đủ kèm tags[]
- Return: article object
DELETE /api/articles/[id]
- Xóa article (cascade xóa article_tags)
- Return: { success: true }
POST /api/tags
Body: { article_id, tag_name }
- Upsert tag (tạo nếu chưa có)
- Insert article_tags
- Return: { tag }
DELETE /api/tags
Body: { article_id, tag_id }
- Xóa khỏi article_tags (không xóa tag)
- Return: { success: true }
Input: JOB-002 hoàn thành (DB schema + supabase.ts)
Output:

6 API routes hoạt động đúng
Test thủ công bằng curl hoặc Postman trước khi báo xong

Constraints:

Tất cả routes phải kiểm tra auth — return 401 nếu chưa login
Dùng Supabase service role key cho server-side routes
Không expose service role key ra client