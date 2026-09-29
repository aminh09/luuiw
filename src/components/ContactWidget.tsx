import { useEffect, useRef, useState } from 'react'
import { socialLinks } from '../config/site'
import { Icon } from './Icon'

export function ContactWidget() {
  const [open, setOpen] = useState(false)
  const widgetRef = useRef<HTMLDivElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!open) return
    firstLinkRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onPointerDown = (event: MouseEvent) => {
      if (!widgetRef.current?.contains(event.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onPointerDown)
    }
  }, [open])

  return (
    <div className="contact-widget" ref={widgetRef}>
      {open && (
        <div aria-label="Các cách liên hệ" className="contact-panel" id="contact-panel">
          <div className="contact-panel-heading">
            <div>
              <strong>Liên hệ với Luuiw</strong>
              <span>Chọn kênh phù hợp với bạn</span>
            </div>
            <button aria-label="Đóng bảng liên hệ" onClick={() => setOpen(false)} type="button">
              <Icon name="close" size={18} />
            </button>
          </div>
          <a href="#gui-yeu-cau" onClick={() => setOpen(false)} ref={firstLinkRef}>
            <span className="contact-link-icon"><Icon name="send" size={18} /></span>
            <span><strong>Gửi yêu cầu mới</strong><small>Điền thông tin chi tiết</small></span>
          </a>
          {socialLinks.map((link) => (
            <a
              href={link.url}
              key={link.label}
              onClick={() => setOpen(false)}
              rel={link.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              target={link.url.startsWith('mailto:') ? undefined : '_blank'}
            >
              <span className="contact-link-icon"><Icon name={link.icon} size={18} /></span>
              <span><strong>{link.label}</strong><small>Mở kênh liên hệ</small></span>
              {!link.url.startsWith('mailto:') && <Icon name="external" size={15} />}
            </a>
          ))}
        </div>
      )}
      <button
        aria-controls="contact-panel"
        aria-expanded={open}
        aria-label={open ? 'Đóng lựa chọn liên hệ' : 'Mở lựa chọn liên hệ'}
        className="contact-trigger"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <Icon name={open ? 'close' : 'message'} size={23} />
        <span>Liên hệ</span>
      </button>
    </div>
  )
}
