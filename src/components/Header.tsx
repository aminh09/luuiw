import { useEffect, useState } from 'react'
import { Icon } from './Icon'

const navItems = [
  { label: 'Dịch vụ', href: '#dich-vu' },
  { label: 'Sản phẩm mẫu', href: '#san-pham' },
  { label: 'Quy trình', href: '#quy-trinh' },
  { label: 'Câu hỏi thường gặp', href: '#faq' },
  { label: 'Liên hệ', href: '#lien-he' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#top" aria-label="Luuiw — về đầu trang">
          <span className="brand-mark" aria-hidden="true">
            L
          </span>
          <span>Luuiw</span>
        </a>

        <button
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
          className="menu-toggle"
          onClick={() => setMenuOpen((current) => !current)}
          type="button"
        >
          <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
        </button>

        <nav
          aria-label="Điều hướng chính"
          className={`primary-nav ${menuOpen ? 'is-open' : ''}`}
          id="primary-navigation"
        >
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            className="button button--primary header-cta"
            href="#gui-yeu-cau"
            onClick={() => setMenuOpen(false)}
          >
            Gửi yêu cầu
          </a>
        </nav>
      </div>
    </header>
  )
}
