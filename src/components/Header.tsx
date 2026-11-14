import { useEffect, useState } from 'react'
import { Icon } from './Icon'

interface HeaderProps {
  activePageIndex?: 'index1' | 'index2'
  onSelectPage?: (page: 'index1' | 'index2') => void
}

const navItemsIndex1 = [
  { label: 'Dịch vụ', href: '#dich-vu' },
  { label: 'Sản phẩm mẫu', href: '#san-pham' },
  { label: 'Quy trình', href: '#quy-trinh' },
  { label: 'Câu hỏi thường gặp', href: '#faq' },
  { label: 'Liên hệ', href: '#lien-he' },
]

export function Header({ activePageIndex = 'index1', onSelectPage }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  const handlePageSwitch = (page: 'index1' | 'index2', hash: string) => {
    onSelectPage?.(page)
    window.location.hash = hash
    setMenuOpen(false)
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Brand */}
        <a
          aria-label="Luuiw — về đầu trang"
          className="brand"
          href="#top"
          onClick={() => handlePageSwitch('index1', '#top')}
        >
          <span aria-hidden="true" className="brand-mark">
            L
          </span>
          <span className="brand-text">
            <strong>Luuiw</strong>
            <small className="brand-tag">Student Lab</small>
          </span>
        </a>

        {/* 2-Index Primary Switcher (Desktop Center) */}
        <div aria-label="Chuyển chế độ xem chính" className="header-view-switch" role="tablist">
          <button
            aria-selected={activePageIndex === 'index1'}
            className={`view-switch-btn ${activePageIndex === 'index1' ? 'is-active' : ''}`}
            onClick={() => handlePageSwitch('index1', '#dich-vu')}
            role="tab"
            type="button"
          >
            <Icon name="sparkle" size={16} />
            <span>Khám phá & Dịch vụ</span>
          </button>
          <button
            aria-selected={activePageIndex === 'index2'}
            className={`view-switch-btn ${activePageIndex === 'index2' ? 'is-active' : ''}`}
            onClick={() => handlePageSwitch('index2', '#gui-yeu-cau')}
            role="tab"
            type="button"
          >
            <Icon name="zap" size={16} />
            <span>Yêu cầu & Công cụ</span>
            <span className="switch-pill-badge">Mới</span>
          </button>
        </div>

        {/* Header Right Area */}
        <div className="header-right-area">
          <nav
            aria-label="Điều hướng chính"
            className={`primary-nav ${menuOpen ? 'is-open' : ''}`}
            id="primary-navigation"
          >
            {/* Mobile view switchers */}
            <div className="mobile-view-nav">
              <button
                className={`mobile-view-btn ${activePageIndex === 'index1' ? 'is-active' : ''}`}
                onClick={() => handlePageSwitch('index1', '#dich-vu')}
                type="button"
              >
                Khám phá dịch vụ
              </button>
              <button
                className={`mobile-view-btn ${activePageIndex === 'index2' ? 'is-active' : ''}`}
                onClick={() => handlePageSwitch('index2', '#gui-yeu-cau')}
                type="button"
              >
                Yêu cầu & Công cụ học tập
              </button>
            </div>

            <ul>
              {navItemsIndex1.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => {
                      handlePageSwitch('index1', item.href)
                      setMenuOpen(false)
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  className={activePageIndex === 'index2' && typeof window !== 'undefined' && window.location.hash === '#dao-van' ? 'nav-item-active' : ''}
                  href="#dao-van"
                  onClick={() => {
                    handlePageSwitch('index2', '#dao-van')
                    setMenuOpen(false)
                  }}
                >
                  Check đạo văn
                </a>
              </li>
              <li>
                <a
                  className={activePageIndex === 'index2' && typeof window !== 'undefined' && (window.location.hash === '#cong-cu' || window.location.hash === '#gpa') ? 'nav-item-active' : ''}
                  href="#cong-cu"
                  onClick={() => {
                    handlePageSwitch('index2', '#cong-cu')
                    setMenuOpen(false)
                  }}
                >
                  Công cụ học tập
                </a>
              </li>
            </ul>

            <a
              className="button button--primary header-cta"
              href="#gui-yeu-cau"
              onClick={() => handlePageSwitch('index2', '#gui-yeu-cau')}
            >
              Gửi yêu cầu
            </a>
          </nav>

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
        </div>
      </div>
    </header>
  )
}
