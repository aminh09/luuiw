import { siteConfig, socialLinks } from '../config/site'
import { Icon } from './Icon'

export function Footer() {
  return (
    <footer className="site-footer" id="lien-he">
      <div className="container footer-grid">
        <div className="footer-brand">
          <a className="brand brand--footer" href="#top">
            <span className="brand-mark" aria-hidden="true">L</span>
            <span>Luuiw</span>
          </a>
          <p>
            Dịch vụ hỗ trợ học tập, hướng dẫn và hoàn thiện sản phẩm số dành
            cho sinh viên.
          </p>
          <p className="footer-owner">Phụ trách: {siteConfig.owner}</p>
        </div>
        <div>
          <h2>Liên hệ</h2>
          <ul className="footer-links">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.url}
                  rel={link.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  target={link.url.startsWith('mailto:') ? undefined : '_blank'}
                >
                  <Icon name={link.icon} size={18} /> {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Thông tin</h2>
          <ul className="footer-links footer-links--plain">
            <li>Phản hồi: {siteConfig.responseHours}</li>
            <li><a href="#/privacy">Chính sách quyền riêng tư</a></li>
            <li><a href="#/terms">Điều khoản dịch vụ</a></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Luuiw. Nội dung thuộc {siteConfig.owner}.</p>
        <p>Hỗ trợ học tập có trách nhiệm — không làm hộ bài thi.</p>
      </div>
    </footer>
  )
}
