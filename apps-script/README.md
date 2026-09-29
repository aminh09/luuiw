# Luuiw Google Apps Script

Thư mục này chứa đầu nhận form giai đoạn 1. Script ghi dữ liệu vào Google Sheets và gửi email bằng `MailApp`.

## Script Properties bắt buộc

| Tên | Giá trị |
| --- | --- |
| `SPREADSHEET_ID` | ID nằm giữa `/d/` và `/edit` trong URL Google Sheet |
| `NOTIFICATION_EMAIL` | Email nhận thông báo đơn mới |
| `SHEET_NAME` | Tùy chọn, mặc định `Requests` |

Không đặt các giá trị này trực tiếp trong `Code.gs`.

## Cơ chế phản hồi

Frontend POST form-urlencoded vào iframe ẩn. Apps Script trả một trang HTML tối giản dùng `postMessage` với `requestToken`. Frontend chỉ hiển thị thành công khi nhận được `ok: true` và `requestId` từ origin Google hợp lệ.

Xem hướng dẫn đầy đủ tại [`../SETUP_GOOGLE_APPS_SCRIPT.md`](../SETUP_GOOGLE_APPS_SCRIPT.md).
