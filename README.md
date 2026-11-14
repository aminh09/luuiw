# Luuiw

Website Luuiw Student Lab hỗ trợ học tập và sản phẩm số cho sinh viên, sử dụng React 19, TypeScript 6 và Vite 8. Bản rà soát source: **2.2.1 (15/11/2026)**. Chủ sở hữu: Anh Minh.

- Website chính theo tài liệu cung cấp: <https://luuiw.vercel.app/>
- GitHub Pages (bản triển khai song song): <https://aminh09.github.io/luuiw/>
- Mã nguồn: <https://github.com/aminh09/luuiw>

## Tính năng giai đoạn 1

- 13 dịch vụ có tìm kiếm, lọc, chi tiết và chọn nhanh.
- 6 sản phẩm minh họa, quy trình sáu bước và FAQ.
- Form yêu cầu có validation, lưu nháp, honeypot và trạng thái đầy đủ.
- Google Apps Script ghi Google Sheets và gửi email.
- Widget liên hệ Zalo, Messenger, Facebook, Instagram và email.
- Chính sách quyền riêng tư, điều khoản và nội dung học thuật có trách nhiệm.
- Responsive, keyboard-friendly và hỗ trợ reduced motion.
- Bộ 5 công cụ miễn phí: rà soát cách diễn đạt nội bộ (không đo tỷ lệ đạo văn), tính GPA, tạo nháp trích dẫn, ước tính thuyết trình và chi phí.
- GitHub Actions triển khai GitHub Pages; có `vercel.json` để hỗ trợ triển khai trên Vercel.
- Lưu bản nháp form tại trình duyệt, có nút xóa nội dung và bản nháp.

## Chạy local

Yêu cầu **Node.js 22.22.2+ hoặc 24.15.0+** và npm (khuyến nghị Node 24 mới, do yêu cầu của các phụ thuộc hiện tại).

```powershell
npm ci
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

Vite dùng đường dẫn asset tương đối (`base: './'`) để hoạt động ở Vercel và GitHub Pages. Workflow Pages build bằng `npm ci` và lấy `VITE_APPS_SCRIPT_URL` từ repository variable cùng tên.

## Tài liệu

- [`PROJECT_SPEC.md`](PROJECT_SPEC.md) — phạm vi giai đoạn 1.
- [`PLAN.md`](PLAN.md) — milestone và tiêu chí hoàn thành.
- [`STATUS.md`](STATUS.md) — tiến độ, quyết định và vấn đề còn lại.
- [`ROADMAP.md`](ROADMAP.md) — hạng mục giai đoạn 2.
- [`CONTENT_GUIDE.md`](CONTENT_GUIDE.md) — chỉnh nội dung.
- [`REVIEW_UPDATE_2026-11-15.md`](REVIEW_UPDATE_2026-11-15.md) — lỗi và thay đổi bản 2.2.1.
- [`ARCHITECTURE_CURRENT.md`](ARCHITECTURE_CURRENT.md) — đối chiếu kiến trúc source thực tế với báo cáo 2.2.0.

## Lưu ý

Luuiw hỗ trợ học tập, hướng dẫn, trình bày và hoàn thiện kỹ thuật; không làm hộ bài thi, không giả mạo danh tính và không cam kết điểm số.

**Lưu ý về kiểm thử và triển khai:** Gói ZIP chứa source, không chứa `node_modules`, `.git` hoặc `dist`; sau khi giải nén cần chạy `npm ci`. Nếu chạy từ Windows sang Linux/macOS phải cài lại thư viện để tải đúng bản native theo hệ điều hành. Chưa có xác nhận gửi form end-to-end trên bản production mới; việc cập nhật mã nguồn không tự động cập nhật website đang chạy.
