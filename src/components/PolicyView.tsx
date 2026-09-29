import { siteConfig } from '../config/site'
import { Icon } from './Icon'

interface PolicyViewProps {
  type: 'privacy' | 'terms'
}

export function PolicyView({ type }: PolicyViewProps) {
  const isPrivacy = type === 'privacy'

  return (
    <div className="policy-page">
      <header className="policy-header">
        <div className="container header-inner">
          <a className="brand" href="#">
            <span className="brand-mark" aria-hidden="true">L</span>
            <span>Luuiw</span>
          </a>
          <a className="button button--ghost button--small" href="#">
            <Icon name="arrow-right" className="icon-flip" size={17} /> Về trang chủ
          </a>
        </div>
      </header>
      <main className="container policy-content">
        <p className="eyebrow">Thông tin sử dụng website</p>
        <h1>{isPrivacy ? 'Chính sách quyền riêng tư' : 'Điều khoản dịch vụ'}</h1>
        <p className="policy-notice">
          Đây là nội dung mẫu cho giai đoạn đầu. Chủ website nên xem lại trước
          khi sử dụng chính thức hoặc khi quy trình dịch vụ thay đổi.
        </p>

        {isPrivacy ? (
          <>
            <section>
              <h2>Dữ liệu được thu thập</h2>
              <p>
                Khi bạn gửi yêu cầu, Luuiw có thể thu thập họ tên, email, số
                điện thoại, dịch vụ quan tâm, nội dung yêu cầu, thời hạn, ngân
                sách, phương thức liên hệ và đường dẫn tài liệu do bạn chủ động
                cung cấp.
              </p>
            </section>
            <section>
              <h2>Mục đích sử dụng</h2>
              <p>
                Dữ liệu chỉ được dùng để tiếp nhận, làm rõ, báo giá, thực hiện
                yêu cầu và gửi các thông báo trực tiếp liên quan đến yêu cầu đó.
              </p>
            </section>
            <section>
              <h2>Quyền truy cập và thời gian lưu</h2>
              <p>
                Chủ sở hữu Luuiw và người hỗ trợ được ủy quyền mới được xem dữ
                liệu. Thông tin dự kiến được lưu trong thời gian cần thiết để xử
                lý yêu cầu và đối soát, sau đó được rà soát để xóa hoặc ẩn danh.
              </p>
            </section>
            <section>
              <h2>Tài liệu riêng tư</h2>
              <p>
                Link tài liệu, nội dung đề bài và nội dung trao đổi được xem là
                thông tin riêng tư. Luuiw không bán dữ liệu cá nhân cho bên thứ
                ba.
              </p>
            </section>
            <section>
              <h2>Yêu cầu chỉnh sửa hoặc xóa</h2>
              <p>
                Bạn có thể liên hệ qua email{' '}
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>{' '}
                để yêu cầu xem, chỉnh sửa hoặc xóa thông tin đã gửi. Luuiw có
                thể cần xác minh người yêu cầu trước khi xử lý.
              </p>
            </section>
          </>
        ) : (
          <>
            <section>
              <h2>Phạm vi dịch vụ</h2>
              <p>
                Luuiw cung cấp hỗ trợ học tập, hướng dẫn, trình bày và hoàn
                thiện kỹ thuật. Luuiw không làm hộ bài thi, không giả mạo danh
                tính và không cam kết điểm số hoặc kết quả học tập.
              </p>
            </section>
            <section>
              <h2>Thỏa thuận trước khi thực hiện</h2>
              <p>
                Phạm vi, sản phẩm bàn giao, giá, thời gian và số lần chỉnh sửa
                phải được hai bên thống nhất trước khi bắt đầu. Thay đổi ngoài
                phạm vi có thể cần đánh giá lại thời gian và chi phí.
              </p>
            </section>
            <section>
              <h2>Trách nhiệm về tài liệu</h2>
              <p>
                Khách hàng chịu trách nhiệm bảo đảm mình có quyền sử dụng và
                chia sẻ các tài liệu gửi cho Luuiw, đồng thời kiểm tra sản phẩm
                trước khi sử dụng hoặc nộp.
              </p>
            </section>
            <section>
              <h2>Quyền từ chối</h2>
              <p>
                Luuiw có quyền từ chối yêu cầu bất hợp pháp, có dấu hiệu gian
                lận, vi phạm quy định học thuật hoặc vượt quá năng lực và thời
                gian có thể đáp ứng.
              </p>
            </section>
            <section>
              <h2>Liên hệ</h2>
              <p>
                Nếu có câu hỏi về điều khoản, hãy liên hệ{' '}
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
