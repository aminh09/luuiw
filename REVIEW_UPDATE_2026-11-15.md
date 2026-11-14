# LUUIW STUDENT LAB — BÁO CÁO KIỂM TRA VÀ CẬP NHẬT SOURCE

**Bản source sau chỉnh sửa:** 2.2.1  
**Ngày thực hiện:** 15/11/2026  
**Đầu vào:** `project.rar` và báo cáo kiến trúc/nghiệp vụ Luuiw Student Lab v2.2.0.  
**Phạm vi:** source frontend, cấu hình, kiểm tra tĩnh, mã và cách trình bày thông tin. Không thao tác website production, Google Sheets hoặc deployment hiện có.

## 1. Những vấn đề tìm thấy và đã xử lý

| Mức độ | Vấn đề ở source trước cập nhật | Thay đổi |
|---|---|---|
| Cao | Công cụ rà soát dùng regex trên câu rập khuôn để sinh ra **% tương đồng** và **% nguyên bản** rồi gắn nhãn tương đương Turnitin/DoIT và ngưỡng `<20%` dù không có kho dữ liệu đối chiếu | Bỏ các chỉ số phần trăm giả định và lựa chọn "cơ sở dữ liệu" không tồn tại. Hiển thị số câu cần rà soát và số từ, công khai giới hạn chức năng |
| Cao | Gợi ý diễn đạt tự chèn tên tác giả/năm 2024 không được xác minh; công cụ tạo trích dẫn mở sẵn nguồn/DOI minh họa như nguồn thật | Không tự tạo nguồn; để trống biểu mẫu trích dẫn. Gợi ý sửa bài có nhắc việc kiểm chứng và phải tự hoàn thiện nội dung trong ngoặc vuông |
| Trung bình | GPA hệ 10 tính bằng hệ 4 × 2,5, không tương đương quy tắc quy đổi thực tế; điểm A gán 3,8, giao diện có thể khiến hiểu nhầm | Hệ 4 dùng thang điểm chữ minh họa (A/A+ = 4.0), hệ 10 chỉ tính sau khi người dùng nhập **đủ số điểm hệ 10 thật**. Nhắc kiểm tra quy chế trường |
| Trung bình | Nút "Áp dụng vào Form" dùng `element.value = ...` và tự bắn event `input`; React controlled input có thể không nhận thay đổi này | Truyền dữ liệu qua React state khi chuyển trang/tab; bổ sung trường hợp kiểm thử |
| Trung bình | App có lời khẳng định “bảo mật 100%”, “chuẩn Turnitin <20%” không có cơ sở xác minh | Sửa chỉ số trang chủ và tuyên bố của công cụ thành các khả năng thực tế |
| Trung bình | Phản hồi `postMessage` chấp nhận origin dạng HTTP cùng hostname Google | Yêu cầu origin HTTPS, giữ token tương quan và sự tương thích với cấu trúc iframe Google Apps Script |
| Thấp | Form lưu bản nháp cá nhân vào `localStorage` nhưng chưa có nút xóa thủ công và chính sách chưa mô tả luồng lưu cục bộ rõ ràng | Thêm nút xóa toàn bộ dữ liệu/bản nháp; giải thích Google Apps Script/Sheets/email trong chính sách |
| Thấp | `event.currentTarget` của sự kiện submit được dùng bên trong callback `requestAnimationFrame` | Chụp tham chiếu form trước callback để focus trường lỗi ổn định hơn |
| Thấp | Khối thuyết trình có văn bản mẫu nói “15 phút” nhưng lượng từ quá ngắn; thanh GPA có thêm cột | Để trống nội dung thuyết trình, cập nhật CSS bảng GPA cuộn ngang trên màn hình nhỏ |

**Giữ nguyên:** cấu trúc 2 trang, nhận diện cyan/navy, 13 mục dịch vụ, 5 tiện ích, điều hướng, responsive CSS, Google Apps Script hiện có và luồng POST qua iframe có xác nhận token.

## 2. Kết quả kiểm tra trong môi trường hiện tại

| Hạng mục | Kết quả |
|---|---|
| Giải nén, đọc source, đối chiếu các cấu hình và tuyến chức năng | Hoàn thành |
| ESLint | **Đạt** (0 lỗi) |
| TypeScript `tsc -b --pretty false` | **Đạt** (0 lỗi) |
| Test cases được định nghĩa | **20** (bản trước có 16, bổ sung kiểm thử cho ngân sách, rà soát trung thực, GPA/trích dẫn và HTTPS origin) |
| Vitest thực thi trên máy rà soát | **Chưa xác minh**: `node_modules` đi kèm là gói Windows, chỉ có binding Rolldown Win32, trong khi máy kiểm tra dùng Linux và không tải gói qua mạng được |
| Vite production build trên máy rà soát | **Chưa xác minh**, cùng lý do thiếu Linux native binding |
| Trải nghiệm thực tế 360px/768px/desktop sau cập nhật | **Chưa xác minh bằng trình duyệt**; CSS vẫn có quy tắc responsive và bảng GPA cho phép cuộn ngang |
| Form gửi thật tới Apps Script / kiểm tra email / Google Sheets | **Không chạy** để tránh tạo dữ liệu production hoặc can thiệp hệ thống thực |
| Triển khai Vercel/GitHub Pages | **Chưa thực hiện** |

## 3. Những sai khác trong bản báo cáo 2.2.0 so với mã nguồn

- **Stack thực tế** trong `package.json`: React 19.3.0, TypeScript 6.0.3, Vite 8.3.1, Vitest 5.0.2; không phải React 18 / TypeScript 5 / Vite 5.
- **Danh mục thực tế:** đúng 13 dịch vụ và 7 nhóm, nhưng tên/phạm vi không trùng hoàn toàn với bảng 13 dòng của tài liệu v2.2.0. `src/config/services.ts` chủ yếu để "Liên hệ báo giá", không công bố mức giá cố định theo bảng báo cáo.
- **Google Apps Script:** mã `src/lib/submitRequest.ts` dùng form POST vào hidden iframe + `postMessage` có token và timeout; khi không được cấu hình thì có liên kết sang Messenger. Không sử dụng lớp `fetch(..., { mode: 'no-cors' })` như phần mô tả trong báo cáo. `no-cors` không xác nhận máy chủ đã nhận thành công.
- **Rà soát văn bản:** không có API hay cơ sở dữ liệu Turnitin/DoIT hoặc kho luận văn; chỉ có quy tắc regex cục bộ. Không thể quảng cáo % tương đồng từ bộ quy tắc này.
- **Source theo thư mục:** FAQ nằm trong `src/config/content.ts`; ngoài các thành phần trong báo cáo còn có `PortfolioVisual.tsx`, file test và thư mục `apps-script/`.
- **Hosting:** có `vercel.json` cho Vercel và GitHub Actions cho GitHub Pages; source không tự chứng minh site production nào đang ở trạng thái cập nhật.

## 4. Những việc cần xác nhận khi triển khai

1. **Cài dependencies theo nền tảng**: Node.js 24.15.0+ khuyến nghị (hoặc Node 22.22.2+), chạy `npm ci` tại thư mục project, không dùng lại `node_modules` Windows ở Linux/macOS.
2. **Kiểm tra**: chạy `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` và kiểm tra giao diện bằng trình duyệt ở độ rộng 360/768/1024/1440px.
3. **Thử nghiệm gửi form**: dùng Apps Script endpoint được chủ sở hữu kiểm soát và một dữ liệu test do chủ sở hữu chấp thuận. Xác nhận Sheet, email, phản hồi mã đơn và việc xóa bản nháp.
4. **Triển khai**: chỉ sau khi toàn bộ kiểm thử đạt, push source lên repository hoặc deploy qua Vercel. Source ZIP không tự thay đổi website đang hoạt động.
5. **Phê duyệt nội dung**: chính sách riêng tư vẫn là mẫu, cần chủ website đánh giá việc lưu dữ liệu, bên xử lý dữ liệu, thời hạn lưu và quy định pháp lý áp dụng trước khi đưa vào sử dụng chính thức.

## 5. Định hướng nâng cấp tiếp

- Nếu muốn đo tương đồng thật, cần tích hợp một dịch vụ có quyền truy cập cơ sở dữ liệu tài liệu phù hợp và trả về dữ liệu có thể kiểm chứng; không thể suy diễn từ regex hoặc N-gram tự sinh.
- Nếu muốn quy đổi GPA theo từng trường (IUH/HUIT...), cần cho phép cấu hình chính xác bảng điểm quy đổi mà trường đó công bố.
- Nếu muốn trích dẫn đúng APA/IEEE/Harvard đến cấp bài báo, nên bổ sung các trường volume, issue, trang, DOI, nhiều tác giả và quy tắc định dạng theo từng loại nguồn.
- Cần đánh giá giới hạn chống spam và phân quyền truy cập Google Sheets trước khi mở rộng số lượng khách hàng.
