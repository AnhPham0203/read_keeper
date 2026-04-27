# TEMPLATE_BLUEPRINT.md
# Readkeeper — Private Reading Collection

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  CHROME EXTENSION                    │
│  content.js → extract page data → POST /api/save    │
└─────────────────────┬───────────────────────────────┘
                      │ HTTPS
┌─────────────────────▼───────────────────────────────┐
│              NEXT.JS APP (Vercel)                    │
│                                                      │
│  Pages: / (home) · /article/[id] · /search          │
│  API Routes:                                         │
│    POST /api/save      — nhận bài từ extension       │
│    GET  /api/articles  — list + filter + search      │
│    GET  /api/articles/[id] — chi tiết 1 bài          │
│    DELETE /api/articles/[id] — xóa bài               │
└─────────────────────┬───────────────────────────────┘
                      │ Supabase JS Client
┌─────────────────────▼───────────────────────────────┐
│              SUPABASE (Postgres)                     │
│  Tables: articles · tags · article_tags             │
│  Auth: Magic Link (chỉ 1 user — email bạn)          │
└─────────────────────────────────────────────────────┘
```

---

## 2. Core Modules

| Module         | Trách nhiệm                                          |
|----------------|------------------------------------------------------|
| Extension      | Detect trang, extract nội dung, gửi lên API          |
| API Routes     | Nhận, validate, lưu vào Supabase                    |
| Article List   | Hiển thị danh sách, filter theo nguồn/tag            |
| Search Engine  | Full-text search qua Supabase tsvector               |
| Reading View   | Render nội dung đã lưu, sạch quảng cáo              |
| Tag Manager    | Tạo/gán/xóa tag khi lưu hoặc sau khi lưu            |
| Auth Guard     | Chặn truy cập nếu chưa login                        |

---

## 3. Data Model

```
Table: articles
┌─────────────────┬──────────────┬──────────────────────────────┐
│ id              │ uuid         │ PK                           │
│ url             │ text         │ unique                       │
│ title           │ text         │                              │
│ content         │ text         │ nội dung full                │
│ excerpt         │ text         │ 300 ký tự đầu               │
│ thumbnail_url   │ text         │ ảnh đại diện                 │
│ source          │ text         │ 'facebook'/'substack'/'other'│
│ author          │ text         │ tên tác giả nếu có          │
│ saved_at        │ timestamptz  │ default now()                │
│ is_read         │ boolean      │ default false                │
│ search_vector   │ tsvector     │ full-text index              │
└─────────────────┴──────────────┴──────────────────────────────┘

Table: tags
┌─────────────────┬──────────────┬─────────────────────┐
│ id              │ uuid         │ PK                  │
│ name            │ text         │ unique              │
│ color           │ text         │ hex color           │
└─────────────────┴──────────────┴─────────────────────┘

Table: article_tags  (many-to-many)
┌─────────────────┬──────────────┬─────────────────────┐
│ article_id      │ uuid         │ FK → articles       │
│ tag_id          │ uuid         │ FK → tags           │
└─────────────────┴──────────────┴─────────────────────┘
```

---

## 4. API Design (high-level)

```
POST /api/save
  body:   { url, title, content, excerpt, thumbnail_url, source, author }
  return: { id, saved_at }

GET /api/articles
  query:  ?source=facebook&tag=design&q=keyword&page=1
  return: { articles: [...], total, page }

GET /api/articles/[id]
  return: article object đầy đủ + tags

DELETE /api/articles/[id]
  return: { success: true }

POST /api/tags
  body:   { article_id, tag_name }
  return: { tag }
```

---

## 5. User Flow

```
[Đang đọc bài trên Facebook/Substack]
        │
        ▼
[Bấm Extension icon]
        │
        ▼
[Popup hiện ra — title đã điền sẵn]
[Người dùng thêm tag nếu muốn → Save]
        │
        ▼
[Extension POST lên /api/save]
        │
        ├── Thành công → "✅ Đã lưu!" → đóng popup
        └── Thất bại   → "❌ Lỗi — thử lại"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Mở Web App — readkeeper.vercel.app]
        │
        ▼
[Chưa login → Magic Link qua email]
        │
        ▼
[Home — danh sách bài đã lưu]
        │
        ├── Filter theo Source (Facebook / Substack / Other)
        ├── Filter theo Tag
        ├── Search theo keyword
        │
        ▼
[Click vào bài → Reading View]
        │
        ├── Đánh dấu đã đọc
        ├── Thêm/xóa tag
        └── Xóa bài
```

---

## Gate Checklist

- [x] Architecture không mâu thuẫn — Extension → Next.js → Supabase một chiều rõ ràng
- [x] Data model cover đủ 5 core features
- [x] User flow không có dead end
- [x] Full-text search dùng Supabase native tsvector — không cần service ngoài