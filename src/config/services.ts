import type { Service, ServiceGroup } from '../types'

export const serviceGroups: ServiceGroup[] = [
  'Học thuật',
  'Trình bày',
  'Dữ liệu',
  'Lập trình',
  'Mô hình hệ thống',
  'Nghề nghiệp',
  'Ôn tập',
]

export const services: Service[] = [
  {
    id: 'bao-cao-tieu-luan',
    name: 'Báo cáo và tiểu luận',
    group: 'Học thuật',
    summary:
      'Hỗ trợ xây dựng bố cục, diễn đạt, trình bày và rà soát báo cáo hoặc tiểu luận theo yêu cầu môn học.',
    deliverables: [
      'File Word có cấu trúc rõ ràng',
      'Trích dẫn và danh mục tài liệu tham khảo',
      'Bản ghi chú những điểm cần tự kiểm tra',
    ],
    requirements: [
      'Đề bài và rubric chấm điểm',
      'Tài liệu hoặc nguồn đã có',
      'Quy định định dạng của trường',
    ],
    turnaround: 'Tùy độ dài và mức độ hoàn thiện của tài liệu đầu vào',
    price: 'Liên hệ báo giá',
    keywords: ['word', 'tiểu luận', 'báo cáo', 'trích dẫn'],
    icon: 'document',
  },
  {
    id: 'bao-cao-thuc-tap',
    name: 'Báo cáo thực tập và thu hoạch',
    group: 'Học thuật',
    summary:
      'Sắp xếp nhật ký, nội dung doanh nghiệp và kết quả thực tập thành báo cáo mạch lạc, đúng biểu mẫu.',
    deliverables: [
      'Khung báo cáo theo biểu mẫu',
      'Nội dung được biên tập và định dạng',
      'Checklist trước khi nộp',
    ],
    requirements: [
      'Biểu mẫu của trường',
      'Thông tin đơn vị thực tập',
      'Nhật ký và nội dung công việc thực tế',
    ],
    turnaround: 'Tham khảo 3–7 ngày sau khi đủ tài liệu',
    price: 'Liên hệ báo giá',
    keywords: ['thực tập', 'thu hoạch', 'nhật ký', 'doanh nghiệp'],
    icon: 'briefcase',
  },
  {
    id: 'de-cuong-nghien-cuu',
    name: 'Đề cương nghiên cứu',
    group: 'Học thuật',
    summary:
      'Hỗ trợ định hình vấn đề, mục tiêu, câu hỏi, mô hình và phương pháp nghiên cứu có căn cứ.',
    deliverables: [
      'Khung đề cương logic',
      'Gợi ý biến số và phương pháp',
      'Danh sách nội dung cần tiếp tục xác minh',
    ],
    requirements: [
      'Chủ đề hoặc lĩnh vực quan tâm',
      'Yêu cầu của giảng viên',
      'Nguồn tài liệu đã tìm được',
    ],
    turnaround: 'Tham khảo 2–5 ngày tùy phạm vi',
    price: 'Liên hệ báo giá',
    keywords: ['nghiên cứu', 'đề cương', 'phương pháp', 'mô hình'],
    icon: 'book',
  },
  {
    id: 'slide-thuyet-trinh',
    name: 'Slide thuyết trình',
    group: 'Trình bày',
    summary:
      'Chuyển nội dung thành câu chuyện trình bày súc tích, có hệ thống thị giác và dễ thuyết trình.',
    deliverables: [
      'File slide có thể chỉnh sửa',
      'Bố cục và biểu đồ đồng nhất',
      'Gợi ý lời dẫn cho các phần chính',
    ],
    requirements: [
      'Nội dung nguồn',
      'Số lượng slide dự kiến',
      'Mẫu nhận diện nếu có',
    ],
    turnaround: 'Tham khảo 1–4 ngày tùy số lượng slide',
    price: 'Liên hệ báo giá',
    keywords: ['powerpoint', 'slide', 'thuyết trình', 'pitch'],
    icon: 'palette',
  },
  {
    id: 'poster-infographic',
    name: 'Poster và infographic',
    group: 'Trình bày',
    summary:
      'Thiết kế bố cục thông tin rõ, dễ đọc cho poster học thuật, sự kiện hoặc infographic tóm tắt.',
    deliverables: [
      'File thiết kế có thể chỉnh sửa',
      'Bản xuất PNG hoặc PDF',
      'Bố cục theo kích thước yêu cầu',
    ],
    requirements: [
      'Nội dung đã duyệt',
      'Kích thước và định dạng',
      'Logo hoặc màu sắc bắt buộc nếu có',
    ],
    turnaround: 'Tham khảo 1–3 ngày',
    price: 'Liên hệ báo giá',
    keywords: ['poster', 'infographic', 'canva', 'thiết kế'],
    icon: 'palette',
  },
  {
    id: 'dinh-dang-word-apa',
    name: 'Định dạng Word, mục lục và APA 7',
    group: 'Trình bày',
    summary:
      'Chuẩn hóa style, mục lục, bảng biểu, đánh số và trích dẫn APA 7 cho tài liệu đã có nội dung.',
    deliverables: [
      'File Word đã chuẩn hóa style',
      'Mục lục và danh mục tự động',
      'Rà soát trích dẫn theo phạm vi thống nhất',
    ],
    requirements: [
      'File Word gốc',
      'Quy định trình bày',
      'Danh mục nguồn tham khảo',
    ],
    turnaround: 'Tham khảo 1–3 ngày tùy độ dài',
    price: 'Liên hệ báo giá',
    keywords: ['apa 7', 'mục lục', 'format', 'word'],
    icon: 'document',
  },
  {
    id: 'khao-sat-excel',
    name: 'Khảo sát, Google Forms và xử lý Excel',
    group: 'Dữ liệu',
    summary:
      'Thiết kế bảng hỏi, cấu trúc Google Forms và làm sạch hoặc tổng hợp dữ liệu Excel cơ bản.',
    deliverables: [
      'Cấu trúc bảng hỏi hoặc form',
      'File dữ liệu được làm sạch',
      'Bảng tổng hợp và biểu đồ theo yêu cầu',
    ],
    requirements: [
      'Mục tiêu khảo sát',
      'Đối tượng trả lời',
      'File dữ liệu gốc nếu đã thu thập',
    ],
    turnaround: 'Tùy số câu hỏi và khối lượng dữ liệu',
    price: 'Liên hệ báo giá',
    keywords: ['excel', 'google forms', 'khảo sát', 'dữ liệu'],
    icon: 'table',
  },
  {
    id: 'lap-trinh-web-java',
    name: 'Java, HTML/CSS/JavaScript',
    group: 'Lập trình',
    summary:
      'Hướng dẫn phân tích yêu cầu, sửa lỗi và hoàn thiện kỹ thuật cho bài tập hoặc sản phẩm lập trình.',
    deliverables: [
      'Mã nguồn theo phạm vi thống nhất',
      'Giải thích cấu trúc và phần quan trọng',
      'Hướng dẫn chạy và kiểm thử',
    ],
    requirements: [
      'Đề bài và tiêu chí chấm',
      'Mã nguồn hiện tại nếu có',
      'Môi trường hoặc phiên bản công nghệ',
    ],
    turnaround: 'Đánh giá sau khi xem đề bài và mã nguồn',
    price: 'Liên hệ báo giá',
    keywords: ['java', 'html', 'css', 'javascript', 'website'],
    icon: 'code',
  },
  {
    id: 'co-so-du-lieu',
    name: 'SQL Server, MySQL và MongoDB',
    group: 'Dữ liệu',
    summary:
      'Hỗ trợ thiết kế, truy vấn, kiểm tra dữ liệu và giải thích cách vận hành cơ sở dữ liệu.',
    deliverables: [
      'Script tạo và truy vấn dữ liệu',
      'Giải thích cấu trúc bảng hoặc collection',
      'Hướng dẫn chạy trong môi trường phù hợp',
    ],
    requirements: [
      'Đề bài hoặc nghiệp vụ',
      'Hệ quản trị và phiên bản',
      'Dữ liệu mẫu không nhạy cảm',
    ],
    turnaround: 'Đánh giá theo số bảng, truy vấn và nghiệp vụ',
    price: 'Liên hệ báo giá',
    keywords: ['sql server', 'mysql', 'mongodb', 'query'],
    icon: 'database',
  },
  {
    id: 'uml',
    name: 'Use Case, Activity, Sequence và Class Diagram',
    group: 'Mô hình hệ thống',
    summary:
      'Mô hình hóa yêu cầu và hành vi hệ thống bằng UML, kèm giải thích để bạn có thể trình bày.',
    deliverables: [
      'Sơ đồ theo phạm vi thống nhất',
      'File nguồn có thể chỉnh sửa',
      'Mô tả tác nhân, luồng và quan hệ chính',
    ],
    requirements: [
      'Mô tả nghiệp vụ',
      'Danh sách chức năng',
      'Công cụ hoặc định dạng mong muốn',
    ],
    turnaround: 'Tham khảo 1–4 ngày tùy số sơ đồ',
    price: 'Liên hệ báo giá',
    keywords: ['uml', 'use case', 'activity', 'sequence', 'class'],
    icon: 'sparkle',
  },
  {
    id: 'erd-chuan-hoa',
    name: 'ERD/EERD và chuẩn hóa dữ liệu',
    group: 'Mô hình hệ thống',
    summary:
      'Phân tích thực thể, quan hệ, khóa và chuẩn hóa dữ liệu từ yêu cầu nghiệp vụ.',
    deliverables: [
      'ERD hoặc EERD có chú thích',
      'Lược đồ quan hệ',
      'Giải thích các bước chuẩn hóa',
    ],
    requirements: [
      'Mô tả nghiệp vụ',
      'Các biểu mẫu hoặc dữ liệu mẫu',
      'Mức chuẩn hóa yêu cầu',
    ],
    turnaround: 'Tham khảo 1–4 ngày tùy độ phức tạp',
    price: 'Liên hệ báo giá',
    keywords: ['erd', 'eerd', 'chuẩn hóa', 'database design'],
    icon: 'database',
  },
  {
    id: 'cv-portfolio',
    name: 'CV và portfolio',
    group: 'Nghề nghiệp',
    summary:
      'Biên tập nội dung và thiết kế CV hoặc portfolio tập trung vào năng lực, dự án và vị trí ứng tuyển.',
    deliverables: [
      'CV hoặc portfolio có thể chỉnh sửa',
      'Bản PDF sẵn sàng gửi',
      'Gợi ý cải thiện nội dung',
    ],
    requirements: [
      'Thông tin học vấn và kinh nghiệm',
      'Vị trí mục tiêu',
      'Dự án hoặc thành tích có thể xác minh',
    ],
    turnaround: 'Tham khảo 1–3 ngày',
    price: 'Liên hệ báo giá',
    keywords: ['cv', 'resume', 'portfolio', 'việc làm'],
    icon: 'user',
  },
  {
    id: 'on-tap-phan-bien',
    name: 'Ôn tập, tóm tắt tài liệu và luyện phản biện',
    group: 'Ôn tập',
    summary:
      'Hệ thống hóa tài liệu, tạo câu hỏi và luyện cách giải thích hoặc phản biện trước buổi trình bày.',
    deliverables: [
      'Bản tóm tắt theo chủ đề',
      'Bộ câu hỏi ôn tập',
      'Gợi ý trả lời câu hỏi phản biện',
    ],
    requirements: [
      'Tài liệu nguồn',
      'Phạm vi kiến thức',
      'Hình thức kiểm tra hoặc trình bày',
    ],
    turnaround: 'Tùy khối lượng tài liệu và độ sâu yêu cầu',
    price: 'Liên hệ báo giá',
    keywords: ['ôn tập', 'tóm tắt', 'phản biện', 'thuyết trình'],
    icon: 'book',
  },
]
