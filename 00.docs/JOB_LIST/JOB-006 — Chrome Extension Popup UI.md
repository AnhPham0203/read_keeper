OB-006 — Chrome Extension Popup UI
Context:
Extension folder riêng tại /extension. Manifest V3. Popup 320px wide.
Người dùng bấm icon → popup hiện → thêm tag → Save.
Task:
Tạo Chrome Extension với cấu trúc:
/extension
  manifest.json
  popup.html
  popup.js
  content.js
  icons/
    icon16.png
    icon48.png
    icon128.png  (placeholder ok)
manifest.json:
json{
  "manifest_version": 3,
  "name": "Readkeeper",
  "version": "1.0",
  "action": { "default_popup": "popup.html" },
  "permissions": ["activeTab", "storage"],
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"]
  }]
}
popup.html — layout:
┌──────────────────────────────┐
│  🔖 Readkeeper               │
├──────────────────────────────┤
│  [Title input — editable]   │
│                              │
│  Tags:                       │
│  [tag input — Enter để thêm]│
│  [tag pill] [tag pill]      │
│                              │
│  [   💾 Lưu bài này   ]     │
│                              │
│  status message area        │
└──────────────────────────────┘
popup.js:

Khi mở popup: gửi message đến content.js lấy title + url
Render tag pills, xóa được
Bấm Save: POST lên READKEEPER_API_URL/api/save
Hiện "✅ Đã lưu!" hoặc "⚠️ Đã có trong thư viện" hoặc "❌ Lỗi"
API URL đọc từ chrome.storage.sync (user tự set 1 lần)

Input: JOB-001 hoàn thành (biết API URL structure)
Output:

/extension folder đủ file, load được vào Chrome DevMode
Popup hiện đúng UI theo wireframe
Tag add/remove trong popup hoạt động

Constraints:

Không dùng framework (React/Vue) trong extension — Vanilla JS thuần
CSS inline hoặc 1 file style.css — không dùng Tailwind trong extension
Màu sắc đúng design system: #FAF7F2, #8B6F47, #2C2420...