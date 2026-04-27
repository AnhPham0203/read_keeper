JOB-008 — Auth Flow
Context:
Chỉ có 1 user duy nhất. Auth bằng Magic Link email qua Supabase.
Sau khi login, session tự động refresh, không cần login lại.
Task:
1. Login Page /app/(auth)/login/page.tsx

Input email + nút "Gửi Magic Link"
Sau khi gửi: hiện thông báo "Kiểm tra email của bạn"
Gọi supabase.auth.signInWithOtp({ email })

2. Auth Callback /app/auth/callback/route.ts

Xử lý redirect sau khi click Magic Link
Exchange code lấy session
Redirect về / (Home)

3. Middleware middleware.ts

Protect tất cả routes dưới /(app)
Nếu chưa có session → redirect về /login
Dùng @supabase/ssr updateSession

4. Logout

Nút logout ở Header
Gọi supabase.auth.signOut() → redirect về /login

5. Extension Auth

Extension gọi API bằng Supabase Anon Key trong header
Thêm hướng dẫn vào README: user paste Anon Key vào extension settings 1 lần

Input: JOB-002 hoàn thành (Supabase Auth đã config)
Output:

Magic Link flow hoạt động end-to-end
Middleware protect đúng routes
Session persist sau khi đóng/mở tab

Constraints:

Dùng @supabase/ssr — không dùng createClient từ @supabase/supabase-js cho server
Cookie-based session — không dùng localStorage
Middleware phải dùng updateSession để refresh token