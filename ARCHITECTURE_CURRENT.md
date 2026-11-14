# KIẾN TRÚC THỰC TẾ — LUUIW STUDENT LAB 2.2.1

Đối chiếu từ mã nguồn `project.rar` được cung cấp, cập nhật ngày 15/11/2026. Đây là mô tả **source**, không phải kết quả kiểm thử production.

## Công nghệ

- React 19.3.0 + TypeScript 6.0.3; Vite 8.3.1, CSS thuần.
- Vitest 5.0.2, Testing Library, ESLint 10.
- SPA gồm hai trang chức năng (Khám phá dịch vụ / Gửi yêu cầu & tiện ích), kèm hai chế độ riêng tư và điều khoản bằng hash routing.
- 13 dịch vụ trong `src/config/services.ts`, 7 nhóm; 6 sản phẩm minh họa trong `src/config/portfolio.ts`.
- Google Apps Script xử lý form POST, lưu yêu cầu Google Sheets và gửi mail, theo cấu hình Script Properties khi có triển khai.
- Hosting: có cấu hình Vercel và GitHub Pages; trang chính được nêu trong tài liệu người dùng là `https://luuiw.vercel.app`.

## 5 tiện ích học tập

1. **Rà soát văn bản cục bộ:** phát hiện một số câu rập khuôn, số liệu chưa có dẫn nguồn gần đó và câu dài bằng quy tắc regex. Không so sánh với kho dữ liệu hoặc tính % đạo văn; không gắn chuẩn Turnitin/DoIT.
2. **GPA:** trung bình có trọng số hệ 4 theo điểm chữ mẫu; trung bình hệ 10 tính riêng từ điểm số hệ 10 đã nhập đầy đủ. Xếp loại và dự báo chỉ để tham khảo, tùy quy chế trường.
3. **Trích dẫn:** tạo bản nháp APA/IEEE/Harvard từ thông tin về nguồn thật do người dùng điền, không tự tạo nguồn hoặc DOI.
4. **Thuyết trình:** ước tính thời gian đọc/nói theo tốc độ tham khảo và gợi ý số slide.
5. **Dự toán:** giá và tiến độ minh họa theo loại dịch vụ, mức phức tạp, độ khẩn; có thể chuyển ngân sách và dịch vụ vào form bằng React state, không phải báo giá chính thức.

## Quy trình gửi yêu cầu

- Validate client; trường honeypot; dữ liệu form nháp lưu tại localStorage của thiết bị, có tùy chọn xóa thủ công.
- POST form vào iframe ẩn của Apps Script với `requestToken` ngẫu nhiên. Chỉ coi thành công khi nhận được `postMessage` có token khớp, origin HTTPS được cho phép và `requestId` của backend.
- Khi timeout/lỗi, giữ nội dung và hiển thị lựa chọn Zalo/Messenger; khi thành công xóa form và bản nháp.
- Code Apps Script vẫn có chống gửi trùng trong CacheService, lưu Google Sheet, escape HTML email và kiểm tra trường bắt buộc. Cần kiểm thử endpoint thật khi triển khai.

## Thư mục quan trọng

```
src/App.tsx                    Điều phối trang, tab, state lựa chọn dịch vụ và ngân sách
src/components/StudentToolkit.tsx  5 tiện ích
src/components/RequestForm.tsx     Form, validation, bản nháp
src/lib/submitRequest.ts          Iframe POST và xác thực phản hồi
src/lib/formValidation.ts        Quy tắc validation
src/config/services.ts           Danh mục 13 dịch vụ
src/config/content.ts            FAQ và quy trình
src/components/PolicyView.tsx    Riêng tư / điều khoản
apps-script/Code.gs              Receiver Google Apps Script
.github/workflows/deploy-pages.yml   GitHub Pages workflow
vercel.json                      Vercel SPA rewrites
```

**Cảnh báo nội dung:** Chính sách riêng tư vẫn có ghi là mẫu cần chủ sở hữu xác nhận; mô tả trên không đồng nghĩa với chứng nhận bảo mật hay đảm bảo thành công 100%.
