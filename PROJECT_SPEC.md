# Luuiw — Đặc tả giai đoạn 1

## Mục tiêu

Xây dựng website tĩnh tiếng Việt cho dịch vụ hỗ trợ học tập Luuiw, phục vụ sinh viên cần hỗ trợ báo cáo, trình bày, nghiên cứu, lập trình, dữ liệu, UML/ERD, CV và portfolio. Website phải hoạt động tốt trên GitHub Pages, minh bạch về phạm vi dịch vụ và không mô phỏng các tính năng chưa có.

## Chủ sở hữu và liên hệ

- Thương hiệu: Luuiw
- Chủ sở hữu: Anh Minh
- Email công khai/nhận thông báo: `le1420445@gmail.com`
- Facebook: `https://www.facebook.com/share/1DvhyxmkCJ/?mibextid=wwXIfr`
- Messenger: `https://m.me/aqeoiterz3.006?hash=FQAsR-lEo32TAhrV&source_id=8585216`
- Zalo: `https://zalo.me/0986876541`
- Instagram: `https://www.instagram.com/_aqueooo.iterz3/`
- Giờ phản hồi: 8:00–24:00
- GitHub: `https://github.com/aminh09`

## Phạm vi chức năng

1. Trang chủ responsive với điều hướng bàn phím và menu mobile.
2. Danh mục 13 dịch vụ cấu hình bằng dữ liệu, có tìm kiếm, lọc, chọn và xem chi tiết.
3. Khu sản phẩm minh họa cấu hình riêng; không tuyên bố là dự án khách hàng thật.
4. Quy trình sáu bước, FAQ, liên hệ và footer.
5. Nút liên hệ nổi hỗ trợ Escape, click bên ngoài và screen reader.
6. Form yêu cầu có validation, honeypot, chống gửi lặp, trạng thái đầy đủ và lưu nháp localStorage.
7. Google Apps Script nhận form, lưu Google Sheets, gửi email chủ website và email xác nhận khách.
8. Khu vực riêng cho chính sách quyền riêng tư và điều khoản dịch vụ.
9. GitHub Actions build và deploy GitHub Pages với base `/luuiw/`.

## Ngoài phạm vi giai đoạn 1

Không làm đăng nhập/OTP, chat nội bộ, trang quản trị, thanh toán, upload file, tài khoản theo dõi đơn, cơ sở dữ liệu người dùng hay thông báo thời gian thực. Google Sheets là công cụ quản lý đơn ban đầu; tài liệu được chia sẻ bằng URL hoặc gửi sau qua kênh liên hệ.

## Kiến trúc

- Frontend: Vite, React, TypeScript và CSS thuần.
- Dữ liệu nội dung: `src/config/`.
- Backend form: Google Apps Script Web App.
- Giao tiếp form: POST form tới iframe ẩn; Apps Script trả kết quả bằng `postMessage` kèm token tương quan. Frontend chỉ báo thành công sau khi nhận phản hồi hợp lệ.
- Lưu trữ: Google Sheets.
- Email: `MailApp`.
- Hosting: GitHub Pages qua GitHub Actions.

## Chất lượng và an toàn

- Nội dung chính tối thiểu 16px, tương phản tốt, focus rõ, reduced motion.
- Responsive tối thiểu 360/768/1024/1440px.
- Không commit secret hoặc dữ liệu khách hàng.
- Chống formula injection, giới hạn độ dài và escape HTML email.
- Không ghi dữ liệu nhạy cảm quá mức hoặc trả stack trace.
- ESLint, TypeScript, unit/smoke test và production build phải đạt trước khi deploy.

## Tiêu chí nghiệm thu

Các luồng tìm kiếm, lọc, xem chi tiết, chọn dịch vụ, validation form, gửi form, trạng thái lỗi, menu liên hệ và liên kết chính sách hoạt động; build GitHub Pages tải đúng asset; tài liệu cài đặt Apps Script đầy đủ; repository và Pages được tạo nếu GitHub cho phép.
