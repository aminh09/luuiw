# Luuiw

Website dịch vụ hỗ trợ học tập và sản phẩm số dành cho sinh viên, được xây bằng Vite, React và TypeScript. Chủ sở hữu: Anh Minh.

- Website: <https://aminh09.github.io/luuiw/>
- Mã nguồn: <https://github.com/aminh09/luuiw>

## Tính năng giai đoạn 1

- 13 dịch vụ có tìm kiếm, lọc, chi tiết và chọn nhanh.
- 6 sản phẩm minh họa, quy trình sáu bước và FAQ.
- Form yêu cầu có validation, lưu nháp, honeypot và trạng thái đầy đủ.
- Google Apps Script ghi Google Sheets và gửi email.
- Widget liên hệ Zalo, Messenger, Facebook, Instagram và email.
- Chính sách quyền riêng tư, điều khoản và nội dung học thuật có trách nhiệm.
- Responsive, keyboard-friendly và hỗ trợ reduced motion.
- GitHub Actions deploy GitHub Pages.

## Chạy local

Yêu cầu Node.js 22.12+ hoặc 24+ và npm.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Website chạy tại URL Vite hiển thị trong terminal. Nếu chưa cấu hình Apps Script URL, form sẽ chuyển người dùng sang Messenger thay vì giả báo thành công.

## Cấu hình form

Xem [`SETUP_GOOGLE_APPS_SCRIPT.md`](SETUP_GOOGLE_APPS_SCRIPT.md). URL Web App được đặt trong `.env.local`:

```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
```

## Kiểm tra chất lượng

```powershell
npm run lint
npm run typecheck
npm run test
npm run build
```

## Cấu trúc chính

```text
apps-script/             Google Apps Script nhận yêu cầu
scripts/                 Script smoke test endpoint
src/components/          Giao diện và tương tác
src/config/              Nội dung dịch vụ, portfolio và liên hệ
src/lib/                 Validation và transport form
.github/workflows/       GitHub Pages workflow
```

## GitHub Pages

Vite dùng base `/luuiw/`. Workflow Pages build bằng `npm ci` và lấy `VITE_APPS_SCRIPT_URL` từ repository variable cùng tên.

## Tài liệu

- [`PROJECT_SPEC.md`](PROJECT_SPEC.md) — phạm vi giai đoạn 1.
- [`PLAN.md`](PLAN.md) — milestone và tiêu chí hoàn thành.
- [`STATUS.md`](STATUS.md) — tiến độ, quyết định và vấn đề còn lại.
- [`ROADMAP.md`](ROADMAP.md) — hạng mục giai đoạn 2.
- [`CONTENT_GUIDE.md`](CONTENT_GUIDE.md) — chỉnh nội dung.

## Lưu ý

Luuiw hỗ trợ học tập, hướng dẫn, trình bày và hoàn thiện kỹ thuật; không làm hộ bài thi, không giả mạo danh tính và không cam kết điểm số.
