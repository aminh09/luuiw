# Hướng dẫn chỉnh nội dung Luuiw

## Thông tin thương hiệu và liên hệ

Sửa [`src/config/site.ts`](src/config/site.ts):

- Tên thương hiệu, chủ sở hữu và giờ phản hồi.
- Email, GitHub, Facebook, Messenger, Zalo, Instagram.
- Link không hợp lệ sẽ không được đưa vào danh sách liên hệ.

Không đặt mật khẩu, token hay credential trong file này. Mọi dữ liệu `VITE_*` đều là công khai sau khi build.

## Dịch vụ

Sửa [`src/config/services.ts`](src/config/services.ts). Mỗi dịch vụ cần:

- `id` duy nhất, viết không dấu và không có khoảng trắng.
- Tên, nhóm, mô tả ngắn.
- Sản phẩm bàn giao và thông tin khách cần chuẩn bị.
- Thời gian chỉ là tham khảo.
- Giá giữ là `Liên hệ báo giá` nếu chưa có bảng giá được phê duyệt.
- Từ khóa tìm kiếm và icon hợp lệ.

Không thêm cam kết điểm số hoặc nội dung có thể bị hiểu là làm hộ bài thi.

## Portfolio

Sửa [`src/config/portfolio.ts`](src/config/portfolio.ts). Hiện tại mọi mục đều là minh họa giao diện. Khi thay bằng dự án thật:

1. Chỉ dùng tài sản bạn có quyền công bố.
2. Xóa hoặc ẩn dữ liệu cá nhân của khách.
3. Ghi đúng vai trò và phạm vi đã thực hiện.
4. Chỉ bỏ nhãn “Sản phẩm minh họa” sau khi component và nội dung đã được cập nhật rõ ràng.

## Quy trình và FAQ

Sửa [`src/config/content.ts`](src/config/content.ts). Câu trả lời phải phản ánh đúng quy trình vận hành thực tế.

## Chính sách

Nội dung nằm trong [`src/components/PolicyView.tsx`](src/components/PolicyView.tsx). Đây là mẫu ban đầu, chủ website cần xem lại khi cách thu thập, lưu trữ hoặc xử lý dữ liệu thay đổi.

## Kiểm tra sau khi sửa

```powershell
npm run lint
npm run typecheck
npm run test
npm run build
```
