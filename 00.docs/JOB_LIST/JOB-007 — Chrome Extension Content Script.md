JOB-007 — Chrome Extension Content Script
Context:
content.js chạy trên trang người dùng đang đọc.
Nhiệm vụ: extract thông tin bài và gửi lên API khi popup bấm Save.
Task:
1. Extract thông tin từ trang
Facebook post:
title    ← og:title hoặc first 100 ký tự của post text
content  ← toàn bộ text của post (querySelector logic)
author   ← tên profile/page
thumbnail← og:image
source   = 'facebook'
Substack post:
title    ← h1.post-title hoặc og:title
content  ← div.body.markup (toàn bộ nội dung bài)
author   ← .post-header .author-name
thumbnail← og:image
source   = 'substack'
Other:
title    ← og:title hoặc document.title
content  ← article tag hoặc main tag (innerText)
author   ← ''
thumbnail← og:image
source   = 'other'
2. Message listener
javascriptchrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageData') {
    sendResponse(extractPageData())
  }
})
3. POST lên API (được gọi từ popup.js)
javascriptasync function saveArticle(data, apiUrl, tags) {
  const res = await fetch(`${apiUrl}/api/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, tags })
  })
  return res.json()
}
Input: JOB-006 hoàn thành (popup.js đã có flow gọi content.js)
Output:

content.js extract đúng title/content/author/thumbnail từ Facebook và Substack
Message passing giữa popup.js ↔ content.js hoạt động
End-to-end: bấm Save trên bài Facebook thật → bài lưu vào Supabase

Constraints:

Facebook DOM thay đổi thường xuyên — dùng nhiều fallback selector
Không dùng eval() hoặc remote code — Chrome sẽ reject extension
Content script không được access Supabase trực tiếp — chỉ gọi qua API