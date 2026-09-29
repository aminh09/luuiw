# Trạng thái dự án Luuiw

Cập nhật: 2026-09-30 (Asia/Ho_Chi_Minh)

## Tổng quan

- Trạng thái: Hoàn thành giai đoạn 1
- Milestone hiện tại: Đã hoàn thành 5/5 milestone
- Thư mục: `D:\project`
- Repository: `https://github.com/aminh09/luuiw`
- GitHub Pages: `https://aminh09.github.io/luuiw/`
- GitHub CLI: đã đăng nhập tài khoản `aminh09`

## Đã hoàn thành

- Xác nhận `D:\project` trống, không có dữ liệu người dùng cần bảo toàn.
- Xác nhận Node.js, npm, Git và GitHub CLI hoạt động.
- Xác nhận repository `aminh09/luuiw` chưa tồn tại.
- Chốt đặc tả và kế hoạch milestone.
- Hoàn tất nền Vite 8, React 19, TypeScript 6, ESLint và Vitest.
- Cài 232 package, npm audit không phát hiện lỗ hổng.
- Cấu hình GitHub Pages base `/luuiw/` và favicon vector Luuiw.

## Kiểm thử Milestone 0

- ESLint: đạt.
- TypeScript typecheck: đạt.
- Vitest smoke test nền: đạt sau khi bổ sung test ban đầu.
- Production build: đạt.

## Milestone 1 — Hoàn thành

- Tạo cấu hình riêng cho site, 13 dịch vụ và 6 sản phẩm minh họa.
- Hoàn thành header responsive, hero, tìm kiếm/lọc, modal chi tiết, portfolio, quy trình, FAQ và footer.
- Tạo hai chế độ xem riêng cho chính sách quyền riêng tư và điều khoản dịch vụ.
- Thêm skip link, focus rõ, Escape cho modal và `prefers-reduced-motion`.
- Không dùng số liệu, đánh giá hay dự án khách hàng giả.

## Kiểm thử Milestone 1

- ESLint: đạt.
- TypeScript typecheck: đạt.
- Vitest: 3/3 test đạt (trang chủ, tìm kiếm/modal, chính sách).
- Production build: đạt; Vite tạo asset với base `/luuiw/`.

## Milestone 2 — Hoàn thành

- Hoàn thành form 11 trường, validation cạnh trường và kiểm tra ngày/URL.
- Lưu nháp localStorage, xóa nháp khi backend xác nhận thành công.
- Thêm honeypot, khóa nút khi gửi và giữ nguyên dữ liệu khi lỗi.
- Gửi qua iframe và chỉ chấp nhận `postMessage` có token tương quan từ origin Google hợp lệ.
- Khi chưa có Apps Script URL, nút chính chuyển thật sang Messenger và không báo thành công giả.
- Hoàn thành widget liên hệ nổi: đóng bằng nút, Escape hoặc click ngoài; không có badge giả.

## Kiểm thử Milestone 2

- ESLint và TypeScript: đạt.
- Vitest: 14/14 test đạt.
- Đã kiểm tra validation bắt buộc, email/điện thoại, URL, ngày, origin giả, timeout, backend lỗi và backend thành công.
- Production build: đạt.

## Milestone 3 — Hoàn thành

- Tạo `apps-script/Code.gs` với health check, tiếp nhận form, mã `ML-YYYYMMDD-XXXX`, Sheet và email.
- Thêm validation backend, giới hạn độ dài, chống formula injection, honeypot và chống gửi trùng 120 giây.
- Escape toàn bộ dữ liệu người dùng trước khi tạo HTML email; không trả stack trace cho trình duyệt.
- Email và Sheet ID dùng Script Properties, không hardcode trong mã.
- Tạo manifest, hướng dẫn Apps Script 10 bước và PowerShell smoke test.
- Hoàn thành README, content guide và GitHub Pages workflow.

## Cần thao tác thủ công

- Chủ website cần tạo Google Sheet, deploy Apps Script và thêm `VITE_APPS_SCRIPT_URL` theo `SETUP_GOOGLE_APPS_SCRIPT.md`.
- Việc này cần đăng nhập/cấp quyền Google nên không thể tự hoàn tất từ mã nguồn local.

## Milestone 4 — Hoàn thành

- ESLint: đạt.
- TypeScript typecheck: đạt.
- Vitest: 16/16 test đạt trên 4 test suite.
- Production build: đạt, npm audit không có lỗ hổng ở thời điểm cài đặt.
- Apps Script và PowerShell smoke test: cú pháp hợp lệ.
- Production preview: HTML, CSS, JavaScript và favicon đều trả HTTP 200 dưới base `/luuiw/`.
- Chrome CDP tại 360, 768, 1024 và 1440px: không tràn ngang, không exception và không log lỗi.
- Link QA: không link ngoài `_blank` thiếu `noopener noreferrer`; không anchor nội bộ hỏng.
- Visual QA desktop và mobile: bố cục, menu, CTA, chữ và minh họa hiển thị đúng.

## Milestone 5 — Hoàn thành

- Khởi tạo Git, kiểm tra secret và commit toàn bộ mã nguồn giai đoạn 1.
- Tạo repository public `aminh09/luuiw` và đẩy nhánh `main`.
- Bật GitHub Pages với nguồn GitHub Actions.
- Workflow build, kiểm thử và deploy đầu tiên hoàn tất thành công.
- URL public trả HTTP 200; HTML, favicon, CSS và JavaScript đều tải đúng dưới base `/luuiw/`.

## Quyết định

- Dùng trực tiếp `D:\project` làm gốc vì đây là thư mục trống được người dùng chỉ định.
- Dùng hash-based policy views để tương thích GitHub Pages không cần rewrite server.
- Dùng iframe POST và `postMessage` có token tương quan cho Apps Script; không dùng `no-cors` rồi giả định thành công.
- Website public khi chưa có Apps Script URL sẽ chuyển khách sang Messenger/Zalo thay vì báo gửi thành công.
- Sản phẩm mẫu dùng minh họa giao diện tự tạo và được ghi rõ là minh họa.

## Vấn đề còn lại

- Chưa có Apps Script Web App URL; chủ website phải tạo Google Sheet, deploy Apps Script và cấu hình URL sau khi mã hoàn tất.
- Nội dung chính sách là mẫu và cần chủ website duyệt trước khi dùng chính thức.
