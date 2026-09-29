# Thiết lập Google Sheets và email cho Luuiw

Frontend vẫn build khi chưa có Apps Script URL, nhưng nút gửi sẽ chuyển sang Messenger và không tuyên bố đã gửi form. Làm đủ các bước dưới đây để bật tiếp nhận tự động.

## 1. Tạo Google Sheet

1. Mở Google Drive và tạo một Google Sheet mới, ví dụ `Luuiw Requests`.
2. Không cần tự tạo header; script sẽ tạo đúng 16 cột ở lần gửi đầu tiên.
3. Sao chép ID trong URL: phần nằm giữa `/d/` và `/edit`.

Các cột được tạo: `requestId`, `createdAt`, `fullName`, `email`, `phone`, `service`, `subject`, `description`, `deadline`, `budget`, `preferredContact`, `attachmentUrl`, `status`, `source`, `userAgent`, `note`.

## 2. Mở Apps Script

Trong Google Sheet, chọn **Extensions → Apps Script**. Đặt tên project, ví dụ `Luuiw Form Receiver`.

## 3. Dán mã nguồn

1. Thay nội dung `Code.gs` trên Apps Script bằng nội dung trong [`apps-script/Code.gs`](apps-script/Code.gs).
2. Mở **Project Settings**, bật hiển thị manifest nếu muốn đồng bộ [`apps-script/appsscript.json`](apps-script/appsscript.json).
3. Đảm bảo timezone là `Asia/Ho_Chi_Minh`.

## 4. Thiết lập Script Properties

Mở **Project Settings → Script Properties → Add script property** và thêm:

| Property | Giá trị |
| --- | --- |
| `SPREADSHEET_ID` | ID Google Sheet ở bước 1 |
| `NOTIFICATION_EMAIL` | `le1420445@gmail.com` |
| `SHEET_NAME` | `Requests` (tùy chọn) |

Không dán credential hoặc mật khẩu vào `Code.gs`.

## 5. Deploy Web App

1. Chọn **Deploy → New deployment**.
2. Chọn loại **Web app**.
3. Description: `Luuiw form v1`.
4. **Execute as:** Me.
5. **Who has access:** Anyone.
6. Chọn **Deploy** và chấp thuận quyền truy cập Google Sheets/gửi email.

Quyền `Anyone` là cần thiết để khách không phải đăng nhập Google. Script vẫn kiểm tra trường bắt buộc, honeypot, giới hạn độ dài, chống gửi trùng và formula injection.

## 6. Lấy Web App URL

Sao chép URL kết thúc bằng `/exec`, dạng:

```text
https://script.google.com/macros/s/DEPLOYMENT_ID/exec
```

Mở URL trong trình duyệt. Nếu `doGet()` hoạt động, trang trả JSON có `"ok": true`.

## 7. Cấu hình URL vào frontend

Tạo `.env.local` tại gốc dự án:

```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
```

`VITE_*` là dữ liệu công khai được đóng gói vào frontend, không phải nơi chứa secret.

Với GitHub Actions, tạo repository variable:

1. GitHub repository → **Settings → Secrets and variables → Actions → Variables**.
2. Tạo variable `VITE_APPS_SCRIPT_URL` với URL `/exec`.
3. Chạy lại workflow Pages.

## 8. Build lại frontend

```powershell
npm run build
```

Kiểm tra nút cuối form hiển thị **Gửi yêu cầu**, không còn thông báo chờ cấu hình.

## 9. Gửi thử một yêu cầu

Có thể điền form trên website hoặc chạy:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\test-apps-script.ps1 `
  -WebAppUrl "https://script.google.com/macros/s/DEPLOYMENT_ID/exec"
```

Lệnh test tạo một dòng thật và có thể gửi email thông báo thật. Không chạy liên tục vì script có chống gửi trùng trong 120 giây.

## 10. Kiểm tra kết quả

1. Google Sheet có dòng mới, trạng thái `Chờ tiếp nhận`.
2. `requestId` có dạng `ML-YYYYMMDD-XXXX`.
3. Email chủ website nhận thông báo.
4. Nếu khách cung cấp email, khách nhận email xác nhận.
5. Nếu lỗi, mở Apps Script → **Executions** để xem loại lỗi; script không ghi toàn bộ nội dung nhạy cảm vào log.

## Cập nhật deployment sau này

Sau khi sửa `Code.gs`, dùng **Deploy → Manage deployments → Edit → New version → Deploy**. Giữ nguyên Web App URL nếu cập nhật cùng deployment.
