import { Icon } from './Icon'

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">
            <Icon name="sparkle" size={16} /> Đồng hành cùng sinh viên
          </p>
          <h1>
            Hỗ trợ học tập và sản phẩm số{' '}
            <span>dành cho sinh viên.</span>
          </h1>
          <p className="hero-description">
            Luuiw hỗ trợ bạn làm rõ yêu cầu, trình bày và hoàn thiện sản phẩm
            học tập theo phạm vi thống nhất. Không cam kết điểm số, không làm hộ
            bài thi.
          </p>
          <div className="hero-actions">
            <a className="button button--primary" href="#dich-vu">
              Xem dịch vụ <Icon name="arrow-right" size={18} />
            </a>
            <a className="button button--secondary" href="#gui-yeu-cau">
              Gửi yêu cầu
            </a>
          </div>
          <ul className="trust-list" aria-label="Cam kết dịch vụ">
            <li>
              <Icon name="check" size={17} /> Phạm vi rõ ràng
            </li>
            <li>
              <Icon name="shield" size={17} /> Tôn trọng riêng tư
            </li>
            <li>
              <Icon name="clock" size={17} /> Phản hồi 8:00–24:00
            </li>
          </ul>
        </div>

        <div className="hero-visual" aria-label="Minh họa quy trình tiếp nhận yêu cầu">
          <div className="visual-orbit visual-orbit--one" aria-hidden="true" />
          <div className="visual-orbit visual-orbit--two" aria-hidden="true" />
          <div className="workspace-card">
            <div className="workspace-topbar">
              <span className="workspace-logo">L</span>
              <div>
                <strong>Yêu cầu học tập</strong>
                <small>Thông tin được bảo mật</small>
              </div>
              <span className="status-dot">Mới</span>
            </div>
            <div className="workspace-body">
              <div className="mock-field mock-field--wide" />
              <div className="mock-row">
                <div className="mock-field" />
                <div className="mock-field" />
              </div>
              <div className="mock-document">
                <span />
                <div>
                  <strong>Báo cáo nghiên cứu</strong>
                  <small>Đã nhận đường dẫn tài liệu</small>
                </div>
                <Icon name="check" size={18} />
              </div>
              <div className="mock-progress">
                <div>
                  <span>Tiếp nhận</span>
                  <span>Làm rõ</span>
                  <span>Thống nhất</span>
                </div>
                <progress aria-label="Tiến độ minh họa" max="3" value="2" />
              </div>
            </div>
          </div>
          <div className="floating-note floating-note--top">
            <Icon name="message" size={18} />
            <span>
              <small>Trao đổi rõ ràng</small>
              <strong>Trước khi bắt đầu</strong>
            </span>
          </div>
          <div className="floating-note floating-note--bottom">
            <Icon name="shield" size={18} />
            <span>
              <small>Tài liệu của bạn</small>
              <strong>Được tôn trọng</strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
