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
          eyebrow="Dịch vụ"
          title="Chọn đúng hỗ trợ bạn đang cần"
          description="Mỗi yêu cầu được xem xét riêng. Phạm vi, thời gian và chi phí chỉ được chốt sau khi Luuiw đã đọc đủ thông tin."
        />

        <div className="service-tools">
          <label className="search-field">
            <span className="sr-only">Tìm kiếm dịch vụ</span>
            <Icon name="search" size={20} />
            <input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm theo tên hoặc nhu cầu..."
              type="search"
              value={query}
            />
          </label>
          <label className="filter-field">
            <span className="sr-only">Lọc theo nhóm dịch vụ</span>
            <Icon name="filter" size={19} />
            <select value={group} onChange={(event) => setGroup(event.target.value)}>
              <option>Tất cả</option>
              {serviceGroups.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <Icon name="chevron-down" size={17} />
          </label>
        </div>

        <div className="service-results" aria-live="polite">
          <span>{filteredServices.length} dịch vụ phù hợp</span>
          {(query || group !== 'Tất cả') && (
            <button
              className="text-button"
              onClick={() => {
                setQuery('')
                setGroup('Tất cả')
              }}
              type="button"
            >
              Xóa bộ lọc
            </button>
          )}
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
