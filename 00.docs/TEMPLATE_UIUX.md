# TEMPLATE_UIUX.md
# Readkeeper — UI/UX Design System

---

## 1. Design Goal

**Calm · Warm · Focused**

> Cảm giác như bước vào một thư viện nhỏ yên tĩnh — mọi thứ có chỗ của nó,
> không có gì làm phiền bạn đọc.

---

## 2. Design System

### Color Palette

```
── Primary ──────────────────────────────────────
Background      #FAF7F2   (kem sáng — nền chính)
Surface         #F2EDE4   (kem đậm hơn — card, sidebar)
Border          #E2D9CC   (đường kẻ nhẹ)

── Text ─────────────────────────────────────────
Text Primary    #2C2420   (nâu đậm — tiêu đề, nội dung)
Text Secondary  #7A6A5E   (nâu nhạt — meta, placeholder)
Text Muted      #B0A090   (rất nhạt — disabled)

── Accent ───────────────────────────────────────
Accent          #8B6F47   (nâu ấm — button, link, active)
Accent Hover    #6F5538   (nâu đậm hơn khi hover)
Accent Light    #EDE0CE   (nền tag, highlight nhẹ)

── Semantic ─────────────────────────────────────
Success         #5C8A5C   (xanh lá tối — đã lưu thành công)
Error           #A05454   (đỏ tối — lỗi)
```

### Typography

```
Font Family:
  Heading  — "Lora" (serif, Google Fonts) — cảm giác sách
  Body     — "Inter" (sans-serif) — dễ đọc màn hình
  Mono     — "JetBrains Mono" — code nếu cần

Type Scale:
  xs   — 12px / line-height 1.5
  sm   — 14px / line-height 1.5
  base — 16px / line-height 1.6
  lg   — 18px / line-height 1.6
  xl   — 22px / line-height 1.4  (Lora)
  2xl  — 28px / line-height 1.3  (Lora)
  3xl  — 36px / line-height 1.2  (Lora)
```

### Spacing & Shape

```
Spacing scale (base 4px):
  4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96

Border Radius:
  sm   — 4px   (input, badge)
  md   — 8px   (card, button)
  lg   — 12px  (popup, modal)
  full — 9999px (tag pill)

Shadow:
  card    — 0 1px 4px rgba(44,36,32,0.08)
  popup   — 0 4px 16px rgba(44,36,32,0.12)
  focused — 0 0 0 2px #8B6F47 (focus ring)
```

### Component Tokens

```
Button Primary:
  bg: #8B6F47 · text: #FAF7F2 · radius: md · px: 16 · py: 8
  hover: bg #6F5538
  font: Inter 14px medium

Button Ghost:
  bg: transparent · text: #8B6F47 · border: 1px #E2D9CC
  hover: bg #EDE0CE

Tag Pill:
  bg: #EDE0CE · text: #6F5538 · radius: full · px: 10 · py: 2
  font: Inter 12px medium

Input:
  bg: #FAF7F2 · border: 1px #E2D9CC · radius: sm
  focus: border #8B6F47 + focus ring
  placeholder: #B0A090
```

---

## 3. Core Screens

| # | Màn hình         | Mô tả                                      |
|---|------------------|--------------------------------------------|
| 1 | Login            | Magic link — nhập email, nhận link         |
| 2 | Home / Feed      | Danh sách bài đã lưu + filter + search     |
| 3 | Reading View     | Đọc nội dung bài, quản lý tag              |
| 4 | Extension Popup  | Popup nhỏ khi bấm icon extension           |
| 5 | Empty State      | Khi chưa có bài nào                        |
| 6 | Error State      | Khi lưu thất bại / không load được        |

---

## 4. Navigation Flow

```
[Login]
   │ (magic link click)
   ▼
[Home / Feed] ◄─────────────────────┐
   │                                │
   ├── Search / Filter              │
   │                                │
   └── Click bài ──► [Reading View] ┘
                         │
                         ├── Thêm/xóa tag
                         ├── Đánh dấu đã đọc
                         └── Xóa bài ──► [Home]

[Extension Popup] (độc lập, overlay trên trang đang đọc)
   │
   ├── Thành công ──► toast "✅ Đã lưu"
   └── Thất bại   ──► toast "❌ Lỗi — thử lại"
```

---

## 5. Wireframe (text-based)

### Screen 1 — Login

```
┌────────────────────────────────────────┐
│                                        │
│         🔖 Readkeeper                  │  ← Lora 2xl, center
│    Thư viện riêng của bạn             │  ← Inter sm, muted
│                                        │
│  ┌──────────────────────────────────┐  │
│  │  your@email.com                  │  │  ← Input
│  └──────────────────────────────────┘  │
│                                        │
│  [   Gửi Magic Link   ]                │  ← Button Primary, full width
│                                        │
│  Kiểm tra email sau khi bấm.          │  ← sm, muted, hidden until sent
│                                        │
└────────────────────────────────────────┘
```

### Screen 2 — Home / Feed

```
┌─────────────────────────────────────────────────────────┐
│  🔖 Readkeeper                          [avatar/logout] │  ← Header
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🔍  Tìm bài viết...                             │   │  ← Search bar
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Tất cả] [Facebook] [Substack] [Khác]    Filter tags ▾ │  ← Source tabs + tag filter
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ [thumbnail]  Tiêu đề bài viết dài...            │   │
│  │              Facebook · Nguyễn Văn A · 2 ngày   │   │
│  │              [tag: design] [tag: ux]             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ [thumbnail]  Bài viết thứ hai...                 │   │
│  │              Substack · John Doe · hôm nay       │   │
│  │              [tag: startup]                      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ [thumbnail]  Bài viết thứ ba...                  │   │
│  │              Facebook · · 5 ngày                 │   │
│  │              [tag: reading]                      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Screen 3 — Reading View

```
┌─────────────────────────────────────────────────────────┐
│  ← Quay lại          [✓ Đã đọc]  [🗑 Xóa]             │  ← Toolbar
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   [thumbnail image]                     │
│                                                         │
│         Tiêu đề Bài Viết Dài Ở Đây                     │  ← Lora 2xl
│                                                         │
│   Facebook · Nguyễn Văn A · Lưu 2 ngày trước          │  ← sm muted
│                                                         │
│   [tag: design]  [tag: ux]  [+ thêm tag]               │  ← Tag row
│   ─────────────────────────────────────────────────    │
│                                                         │
│   Nội dung bài viết đầy đủ hiển thị ở đây,             │  ← Inter base
│   với line-height thoải mái, max-width 680px            │
│   để dễ đọc...                                          │
│                                                         │
│   [Xem bài gốc ↗]                                      │  ← link nhỏ cuối
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Screen 4 — Extension Popup

```
┌──────────────────────────────┐
│  🔖 Readkeeper               │  ← header nhỏ
├──────────────────────────────┤
│                              │
│  Tiêu đề bài (auto-fill)    │  ← editable input
│                              │
│  Tags:                       │
│  ┌──────────────────────┐   │
│  │ + Thêm tag...        │   │  ← tag input
│  └──────────────────────┘   │
│  [design] [ux]              │  ← tags đã chọn
│                              │
│  [   💾 Lưu bài này   ]     │  ← Button Primary full width
│                              │
└──────────────────────────────┘
  width: 320px · max-height: 400px
```

### Screen 5 — Empty State

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    📚                                   │  ← icon lớn
│                                                         │
│            Thư viện đang trống                          │  ← Lora xl
│                                                         │
│    Cài extension và bấm lưu khi đọc bài hay            │  ← sm muted
│                                                         │
│         [Hướng dẫn cài extension]                      │  ← Button Ghost
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Component Architecture

```
App
├── Layout
│   ├── Header (logo + logout)
│   └── Main
│
├── Pages
│   ├── LoginPage
│   │   └── MagicLinkForm
│   │
│   ├── HomePage
│   │   ├── SearchBar
│   │   ├── SourceTabs
│   │   ├── TagFilter (dropdown)
│   │   ├── ArticleList
│   │   │   ├── ArticleCard (thumbnail, title, meta, tags)
│   │   │   └── EmptyState
│   │   └── Pagination
│   │
│   └── ReadingPage
│       ├── Toolbar (back, read toggle, delete)
│       ├── ArticleHeader (title, meta)
│       ├── TagRow (tag pills + add tag input)
│       ├── ArticleContent
│       └── ExternalLink
│
└── Extension
    └── Popup
        ├── TitleInput
        ├── TagInput
        └── SaveButton
```

---

## 7. Responsive Strategy

```
── Breakpoints ─────────────────────────────
Mobile   < 640px
Tablet   640px – 1024px
Desktop  > 1024px

── Home / Feed ─────────────────────────────
Desktop  : max-width 860px, centered, 1 column card
Tablet   : max-width 680px, centered
Mobile   : full width, thumbnail nhỏ hơn, text truncate

── Reading View ────────────────────────────
Desktop  : max-width 680px, centered (optimal reading width)
Tablet   : max-width 600px
Mobile   : full width, padding 16px

── Extension Popup ─────────────────────────
Fixed    : 320px wide — không responsive (Chrome popup)

── Typography scale mobile ─────────────────
2xl → xl  (tiêu đề nhỏ lại)
base → sm (body nhỏ lại 1 bậc)
```

---

## Gate Checklist

- [x] Design system nhất quán — 1 palette, 2 fonts, spacing cố định
- [x] Tất cả 5 core features đều có màn hình tương ứng
- [x] Extension popup được thiết kế riêng đúng kích thước Chrome
- [x] Responsive strategy đủ 3 breakpoint
- [x] Empty state và Error state có wireframe