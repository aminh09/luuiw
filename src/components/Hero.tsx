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

        <div className="hero-visual" aria-label="Bảng điều khiển học thuật Luuiw Student Lab">
          <div className="visual-orbit visual-orbit--one" aria-hidden="true" />
          <div className="visual-orbit visual-orbit--two" aria-hidden="true" />
          <div className="hero-dashboard-card">
            {/* Topbar */}
            <div className="dashboard-topbar">
              <div className="dashboard-brand-col">
                <span className="dashboard-logo">L</span>
                <div className="dashboard-brand-info">
                  <strong>Luuiw Student Lab</strong>
                  <small>Hỗ trợ học thuật & Chuyển đổi số</small>
                </div>
              </div>
              <span className="live-status-pill">
                <span className="dot-pulse" />
                Trực tuyến 8:00–24:00
              </span>
            </div>

            {/* Metrics Row */}
            <div className="dashboard-metrics-grid">
              <div className="metric-chip">
                <span className="metric-val">13+</span>
                <span className="metric-lbl">Chuyên đề hỗ trợ</span>
              </div>
              <div className="metric-chip">
                <span className="metric-val">&lt; 20%</span>
                <span className="metric-lbl">Chuẩn Turnitin/DoIT</span>
              </div>
              <div className="metric-chip">
                <span className="metric-val">100%</span>
                <span className="metric-lbl">Bảo mật sinh viên</span>
              </div>
            </div>

            {/* Active Academic Workflow Task */}
            <div className="dashboard-task-preview">
              <div className="task-header">
                <div className="task-icon-box">
                  <Icon name="document" size={18} />
                </div>
                <div className="task-info">
                  <strong>Đề tài & Báo cáo nghiên cứu mẫu</strong>
                  <small>Tiểu luận · Đồ án tốt nghiệp · NCKH</small>
                </div>
                <span className="task-status-tag">Đang tiếp nhận</span>
              </div>

              {/* Progress Milestones */}
              <div className="task-stepper">
                <div className="step-item step--completed">
                  <span className="step-bullet"><Icon name="check" size={12} /></span>
                  <span className="step-text">Khảo sát &amp; Làm rõ</span>
                </div>
                <div className="step-line step--active" />
                <div className="step-item step--active">
                  <span className="step-bullet">2</span>
                  <span className="step-text">Rà soát đạo văn</span>
                </div>
                <div className="step-line" />
                <div className="step-item">
                  <span className="step-bullet">3</span>
                  <span className="step-text">Hoàn thiện bàn giao</span>
                </div>
              </div>
            </div>

            {/* Quick feature tags */}
            <div className="dashboard-quick-tags">
              <span className="tag-pill"><Icon name="scan" size={13} /> Check đạo văn</span>
              <span className="tag-pill"><Icon name="quote" size={13} /> Trích dẫn APA 7</span>
              <span className="tag-pill"><Icon name="calculator" size={13} /> Tính GPA hệ 4</span>
            </div>
          </div>

          <div className="floating-note floating-note--top">
            <Icon name="message" size={18} />
            <div className="floating-text">
              <small>Quy trình minh bạch</small>
              <strong>Làm rõ trước khi bắt đầu</strong>
            </div>
          </div>
          <div className="floating-note floating-note--bottom">
            <Icon name="shield" size={18} />
            <div className="floating-text">
              <small>Tài liệu &amp; Ý tưởng</small>
              <strong>Bảo mật riêng tư 100%</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
