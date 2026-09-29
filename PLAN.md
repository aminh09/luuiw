# Kế hoạch triển khai Luuiw

## Milestone 0 — Nền tảng

- Kiểm tra thư mục, toolchain, GitHub CLI và repository đích.
- Chốt đặc tả, phạm vi, kiến trúc và giả định.
- Tạo cấu trúc Vite/React/TypeScript và bộ lệnh chất lượng.

Tiêu chí: dự án cài được dependency, lint/typecheck/test/build có thể chạy.

## Milestone 1 — Nội dung và giao diện lõi

- Tạo cấu hình site, 13 dịch vụ và portfolio minh họa.
- Xây header, hero, danh mục, portfolio, quy trình, FAQ và footer.
- Tạo trang/chế độ xem chính sách và điều khoản.
- Hoàn thiện responsive, focus và reduced motion.

Tiêu chí: mọi nội dung bắt buộc hiển thị đúng; tìm kiếm, lọc, modal chi tiết và menu mobile hoạt động.

## Milestone 2 — Form và liên hệ

- Form validation, lưu nháp, honeypot, trạng thái loading/success/error.
- Iframe POST + `postMessage` xác nhận kết quả Apps Script.
- Nút liên hệ nổi và fallback khi endpoint chưa cấu hình.

Tiêu chí: form không giả thành công, không mất dữ liệu khi lỗi và chống bấm gửi liên tục.

## Milestone 3 — Google Apps Script và tài liệu

- `doGet`, `doPost`, Sheet, email, chống spam/trùng/formula injection.
- README triển khai Apps Script, lệnh test và tài liệu cấu hình nội dung.

Tiêu chí: mã Apps Script đầy đủ, không chứa secret và có quy trình thiết lập từng bước.

## Milestone 4 — Kiểm thử và QA

- ESLint, TypeScript, unit test, smoke test và production build.
- Kiểm tra asset base, link, console, responsive và bàn phím.
- Visual QA bằng trình duyệt headless nếu có sẵn.

Tiêu chí: tất cả kiểm tra đạt, không còn lỗi nghiêm trọng.

## Milestone 5 — GitHub và triển khai

- Git init, secret scan, commit.
- Tạo repository `aminh09/luuiw`, push nhánh chính.
- Chạy và theo dõi GitHub Pages workflow.
- Kiểm tra URL public và asset.

Tiêu chí: workflow xanh và URL public truy cập được; nếu bị chặn bởi quyền ngoài, ghi rõ thao tác thủ công duy nhất còn lại.
