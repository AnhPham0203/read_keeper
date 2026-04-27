# PROJECT INTAKE

## Product Name
**Readkeeper** — Private Reading Collection

## Problem Statement
Người dùng đọc nhiều bài viết hay trên Facebook và Substack
nhưng không có cách lưu lại có tổ chức. Bookmark trình duyệt
thì lộn xộn, không tìm được, không có nội dung offline.

## Target Users
- 1 người dùng duy nhất (private)
- Đọc nhiều trên Facebook và Substack
- Có GitHub, thoải mái với Vercel/Supabase
- Không muốn viết code để vận hành

## Core Features (5)
1. Browser Extension — bấm 1 nút để lưu bài đang đọc
2. Auto-extract — tự động lấy title, nội dung, nguồn, ảnh thumbnail
3. Tag system — tự gán tag khi lưu
4. Search — tìm theo tag + nguồn + từ khóa trong nội dung
5. Reading view — đọc lại bài đã lưu ngay trong app

## Platform
- Web app (frontend + backend)
- Browser Extension (Chrome/Edge)

## Tech Stack
- Frontend: Next.js (deploy Vercel — free tier)
- Database: Supabase (Postgres + Auth — free tier)
- Extension: Vanilla JS (Chrome Extension Manifest V3)
- Không cần backend riêng — Next.js API Routes đủ dùng

## Success Criteria
- Bấm extension → bài được lưu trong < 3 giây
- Tìm kiếm ra đúng bài trong < 1 giây
- Chạy ổn định trên Vercel free tier
- Không cần động tay vào code sau khi deploy