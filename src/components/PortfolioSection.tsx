import { portfolioItems } from '../config/portfolio'
import { PortfolioVisual } from './PortfolioVisual'
import { SectionHeading } from './SectionHeading'

export function PortfolioSection() {
  return (
    <section className="section section--tinted" id="san-pham">
      <div className="container">
        <SectionHeading
          align="center"
          eyebrow="Sản phẩm mẫu"
          title="Hình dung rõ hơn về kết quả"
          description="Các hình dưới đây là sản phẩm minh họa do Luuiw tự dựng, không phải dự án đã giao cho khách hàng."
        />
        <div className="portfolio-grid">
          {portfolioItems.map((item) => (
            <article className="portfolio-card" key={item.id}>
              <div className={`portfolio-frame portfolio-frame--${item.kind}`}>
                <span className="sample-label">Sản phẩm minh họa</span>
                <PortfolioVisual kind={item.kind} />
              </div>
              <div className="portfolio-content">
                <p>{item.category}</p>
                <h3>{item.title}</h3>
                <div className="tag-list" aria-label="Định dạng và chủ đề">
                  {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <p className="portfolio-description">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
