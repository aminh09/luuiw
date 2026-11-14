import { useMemo, useState } from 'react'
import { serviceGroups, services } from '../config/services'
import type { Service } from '../types'
import { Icon } from './Icon'
import { SectionHeading } from './SectionHeading'

interface ServicesSectionProps {
  onOpenDetails: (service: Service) => void
  onSelect: (service: Service) => void
}

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
}

export function ServicesSection({
  onOpenDetails,
  onSelect,
}: ServicesSectionProps) {
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState('Tất cả')

  const filteredServices = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim())
    return services.filter((service) => {
      const matchesGroup = group === 'Tất cả' || service.group === group
      const searchable = normalizeText(
        [
          service.name,
          service.group,
          service.summary,
          ...service.keywords,
        ].join(' '),
      )
      return matchesGroup && (!normalizedQuery || searchable.includes(normalizedQuery))
    })
  }, [group, query])

  return (
    <section className="section services-section" id="dich-vu">
      <div className="container">
        <SectionHeading
          badge="13 dịch vụ tiêu chuẩn"
          description="Mỗi yêu cầu được xem xét riêng. Phạm vi, thời gian và chi phí chỉ được chốt sau khi Luuiw đã đọc đủ thông tin."
          eyebrow="Danh mục Dịch vụ"
          title="Chọn đúng hỗ trợ bạn đang cần"
        />

        {/* Category Pills Bar (Quick 1-click filter) */}
        <div aria-label="Bộ lọc danh mục nhanh" className="category-pills-bar" role="tablist">
          <button
            aria-selected={group === 'Tất cả'}
            className={`category-pill ${group === 'Tất cả' ? 'is-active' : ''}`}
            onClick={() => setGroup('Tất cả')}
            role="tab"
            type="button"
          >
            <span>Tất cả</span>
            <small>({services.length})</small>
          </button>
          {serviceGroups.map((g) => {
            const count = services.filter((s) => s.group === g).length
            return (
              <button
                aria-selected={group === g}
                className={`category-pill ${group === g ? 'is-active' : ''}`}
                key={g}
                onClick={() => setGroup(g)}
                role="tab"
                type="button"
              >
                <span>{g}</span>
                <small>({count})</small>
              </button>
            )
          })}
        </div>

        <div className="service-tools">
          <label className="search-field">
            <span className="sr-only">Tìm kiếm dịch vụ</span>
            <Icon name="search" size={19} />
            <input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm theo tên dịch vụ, môn học, kỹ năng (ví dụ: Tiểu luận, SQL, Slide, UML, Python)..."
              type="search"
              value={query}
            />
          </label>

          <div className="service-results" aria-live="polite">
            <span className="results-badge">
              <Icon name="check" size={15} />
              <strong>{filteredServices.length} dịch vụ phù hợp</strong>
              {group !== 'Tất cả' && <small>({group})</small>}
            </span>
            {(query || group !== 'Tất cả') && (
              <button
                className="text-button"
                onClick={() => {
                  setQuery('')
                  setGroup('Tất cả')
                }}
                type="button"
              >
                Đặt lại
              </button>
            )}
          </div>
        </div>

        {filteredServices.length > 0 ? (
          <div className="service-grid">
            {filteredServices.map((service) => (
              <article className="service-card" key={service.id}>
                <div className="service-card-top">
                  <span className="service-icon">
                    <Icon name={service.icon} size={23} />
                  </span>
                  <span className="service-group">{service.group}</span>
                </div>
                <h3>{service.name}</h3>
                <p>{service.summary}</p>
                <div className="service-time">
                  <Icon name="clock" size={16} />
                  <span>{service.turnaround}</span>
                </div>
                <div className="service-price">{service.price}</div>
                <div className="service-actions">
                  <button
                    className="button button--small button--primary"
                    onClick={() => onSelect(service)}
                    type="button"
                  >
                    Chọn dịch vụ
                  </button>
                  <button
                    className="button button--small button--ghost"
                    onClick={() => onOpenDetails(service)}
                    type="button"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Icon name="search" size={28} />
            <h3>Chưa tìm thấy dịch vụ phù hợp</h3>
            <p>Thử từ khóa ngắn hơn hoặc chọn lại nhóm dịch vụ.</p>
          </div>
        )}
      </div>
    </section>
  )
}
