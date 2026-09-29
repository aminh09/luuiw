import { useEffect, useRef } from 'react'
import type { Service } from '../types'
import { Icon } from './Icon'

interface ServiceModalProps {
  service: Service | null
  onClose: () => void
  onSelect: (service: Service) => void
}

export function ServiceModal({ service, onClose, onSelect }: ServiceModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!service) return
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
      previousFocus?.focus()
    }
  }, [service, onClose])

  if (!service) return null

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        aria-labelledby="service-dialog-title"
        aria-modal="true"
        className="service-modal"
        role="dialog"
      >
        <button
          aria-label="Đóng chi tiết dịch vụ"
          className="icon-button modal-close"
          onClick={onClose}
          ref={closeButtonRef}
          type="button"
        >
          <Icon name="close" />
        </button>

        <div className="modal-heading">
          <span className="service-icon">
            <Icon name={service.icon} size={24} />
          </span>
          <div>
            <p className="service-group">{service.group}</p>
            <h2 id="service-dialog-title">{service.name}</h2>
          </div>
        </div>
        <p className="modal-summary">{service.summary}</p>

        <div className="modal-columns">
          <div>
            <h3>Bạn sẽ nhận được</h3>
            <ul className="check-list">
              {service.deliverables.map((item) => (
                <li key={item}>
                  <Icon name="check" size={17} /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Bạn cần chuẩn bị</h3>
            <ul className="check-list check-list--neutral">
              {service.requirements.map((item) => (
                <li key={item}>
                  <Icon name="arrow-right" size={17} /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="modal-meta">
          <div>
            <span>Thời gian tham khảo</span>
            <strong>{service.turnaround}</strong>
          </div>
          <div>
            <span>Chi phí</span>
            <strong>{service.price}</strong>
          </div>
        </div>

        <div className="modal-actions">
          <button className="button button--ghost" onClick={onClose} type="button">
            Đóng
          </button>
          <button
            className="button button--primary"
            onClick={() => onSelect(service)}
            type="button"
          >
            Chọn dịch vụ này <Icon name="arrow-right" size={18} />
          </button>
        </div>
      </section>
    </div>
  )
}
