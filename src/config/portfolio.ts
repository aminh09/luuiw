import type { PortfolioItem } from '../types'

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'word-report',
    title: 'Báo cáo Word có hệ thống',
    category: 'Tài liệu học thuật',
    description:
      'Minh họa cách tổ chức trang bìa, mục lục, nội dung, bảng biểu và tài liệu tham khảo.',
    tags: ['Word', 'APA 7', 'Mục lục'],
    kind: 'document',
  },
  {
    id: 'research-slides',
    title: 'Slide nghiên cứu rõ trọng tâm',
    category: 'Trình bày',
    description:
      'Minh họa bộ slide dùng phân cấp chữ, biểu đồ và khoảng trắng để hỗ trợ thuyết trình.',
    tags: ['PowerPoint', 'Nghiên cứu', 'Biểu đồ'],
    kind: 'slides',
  },
  {
    id: 'uml-erd',
    title: 'Sơ đồ UML và ERD',
    category: 'Mô hình hệ thống',
    description:
      'Minh họa cách trình bày thực thể, quan hệ và luồng nghiệp vụ dễ theo dõi.',
    tags: ['UML', 'ERD', 'Nghiệp vụ'],
    kind: 'diagram',
  },
  {
    id: 'student-website',
    title: 'Website sản phẩm học tập',
    category: 'Lập trình',
    description:
      'Minh họa giao diện responsive có cấu trúc, trạng thái tương tác và mã nguồn dễ tiếp tục phát triển.',
    tags: ['React', 'Responsive', 'UI/UX'],
    kind: 'website',
  },
  {
    id: 'student-cv',
    title: 'CV tập trung vào năng lực',
    category: 'Nghề nghiệp',
    description:
      'Minh họa CV gọn một trang, nhấn mạnh kỹ năng, dự án và thông tin có thể xác minh.',
    tags: ['CV', 'Portfolio', 'Ứng tuyển'],
    kind: 'resume',
  },
  {
    id: 'excel-analysis',
    title: 'Bảng phân tích Excel',
    category: 'Dữ liệu',
    description:
      'Minh họa bảng tổng hợp có chỉ số chính, biểu đồ và vùng dữ liệu được chuẩn hóa.',
    tags: ['Excel', 'Dashboard', 'Khảo sát'],
    kind: 'spreadsheet',
  },
]
