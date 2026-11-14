import { useCallback, useEffect, useState } from 'react'
import { ContactWidget } from './components/ContactWidget'
import { FaqSection } from './components/FaqSection'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Icon } from './components/Icon'
import { PolicyView } from './components/PolicyView'
import { PortfolioSection } from './components/PortfolioSection'
import { ProcessSection } from './components/ProcessSection'
import { RequestForm } from './components/RequestForm'
import { ServiceModal } from './components/ServiceModal'
import { ServicesSection } from './components/ServicesSection'
import { StudentToolkit } from './components/StudentToolkit'
import type { Service } from './types'

type PageView = 'index1' | 'index2' | 'privacy' | 'terms'

function getPageView(): PageView {
  const hash = window.location.hash
  if (hash === '#/privacy') return 'privacy'
  if (hash === '#/terms') return 'terms'
  if (
    hash === '#gui-yeu-cau' ||
    hash === '#dat-yeu-cau' ||
    hash === '#cong-cu' ||
    hash === '#dao-van'
  ) {
    return 'index2'
  }
  return 'index1'
}

function getInitialSubTab(): 'form' | 'tools' {
  const hash = typeof window !== 'undefined' ? window.location.hash : ''
  if (hash === '#cong-cu' || hash === '#dao-van') return 'tools'
  return 'form'
}

function App() {
  const [view, setView] = useState<PageView>(getPageView)
  const [activeService, setActiveService] = useState<Service | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [index2Tab, setIndex2Tab] = useState<'form' | 'tools'>(getInitialSubTab)
  const [estimatorBudget, setEstimatorBudget] = useState<{ value: string } | null>(null)

  useEffect(() => {
    const onHashChange = () => {
      const nextView = getPageView()
      setView(nextView)
      if (window.location.hash === '#cong-cu' || window.location.hash === '#dao-van') {
        setIndex2Tab('tools')
      } else if (window.location.hash === '#gui-yeu-cau') {
        setIndex2Tab('form')
      }

      if (nextView === 'index1' || nextView === 'index2') {
        window.requestAnimationFrame(() => {
          const rawId = window.location.hash.slice(1)
          if (rawId && !rawId.startsWith('/')) {
            document.getElementById(rawId)?.scrollIntoView({ behavior: 'smooth' })
          } else {
            window.scrollTo({ top: 0 })
          }
        })
      } else {
        window.scrollTo({ top: 0 })
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const closeModal = useCallback(() => setActiveService(null), [])

  const selectService = (service: Service) => {
    setEstimatorBudget(null)
    setSelectedService(service)
    setActiveService(null)
    setIndex2Tab('form')
    setView('index2')
    window.location.hash = '#gui-yeu-cau'
    window.requestAnimationFrame(() => {
      document.getElementById('gui-yeu-cau')?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  const handleApplyFromEstimator = (service: Service, budget: string) => {
    setSelectedService(service)
    // Keep React as the owner of form inputs instead of mutating the DOM.
    setEstimatorBudget({ value: budget })
    setIndex2Tab('form')
    window.location.hash = '#gui-yeu-cau'
    window.requestAnimationFrame(() => {
      document.getElementById('gui-yeu-cau')?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  const switchToPage = (page: 'index1' | 'index2') => {
    setView(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (view === 'privacy' || view === 'terms') {
    return <PolicyView type={view} />
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        Bỏ qua điều hướng
      </a>
      <Header
        activePageIndex={view === 'index2' ? 'index2' : 'index1'}
        onSelectPage={switchToPage}
      />

      <main id="main-content">
        {/* ==================== INDEX 1: KHÁM PHÁ & DỊCH VỤ ==================== */}
        {view === 'index1' && (
          <div className="view-container view-fade-in" id="index-1-view">
            <Hero />
            <ServicesSection
              onOpenDetails={setActiveService}
              onSelect={selectService}
            />
            <PortfolioSection />
            <ProcessSection />
            <FaqSection />

            {/* CTA Transition Banner to Index 2 */}
            <section className="section index-transition-section">
              <div className="container">
                <div className="index-transition-card">
                  <div className="transition-badge">
                    <Icon name="zap" size={16} />
                    <span>Đặt yêu cầu & Công cụ học tập</span>
                  </div>
                  <h2>Sẵn sàng bắt đầu hoặc dùng thử bộ công cụ sinh viên?</h2>
                  <p>
                    Gửi yêu cầu hỗ trợ hoàn thiện bài làm hoặc sử dụng bộ công cụ tính điểm GPA, rà soát cách viết, tạo trích dẫn APA & IEEE hoàn toàn miễn phí.
                  </p>
                  <div className="transition-actions">
                    <button
                      className="button button--primary"
                      onClick={() => {
                        setIndex2Tab('form')
                        switchToPage('index2')
                        window.location.hash = '#gui-yeu-cau'
                      }}
                      type="button"
                    >
                      <Icon name="send" size={18} />
                      <span>Gửi yêu cầu dịch vụ</span>
                    </button>
                    <button
                      className="button button--secondary"
                      onClick={() => {
                        setEstimatorBudget(null)
                        setIndex2Tab('tools')
                        switchToPage('index2')
                        window.location.hash = '#cong-cu'
                      }}
                      type="button"
                    >
                      <Icon name="calculator" size={18} />
                      <span>Mở bộ công cụ sinh viên</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ==================== INDEX 2: ĐẶT YÊU CẦU & CÔNG CỤ HỌC TẬP ==================== */}
        {view === 'index2' && (
          <div className="view-container view-fade-in" id="index-2-view">
            <section className="index2-hero-banner">
              <div className="container">
                <div className="index2-badge">
                  <span className="dot-pulse" />
                  <span>Trung tâm Dịch vụ & Tiện ích Sinh viên</span>
                </div>
                <h1>Đặt dịch vụ & Tiện ích học tập</h1>
                <p>
                  Gửi yêu cầu hỗ trợ hoàn thiện bài làm hoặc sử dụng bộ công cụ tính điểm GPA, rà soát cách viết, trích dẫn khoa học ngay tại đây.
                </p>

                {/* Subtab Switcher */}
                <div aria-label="Lựa chọn tính năng trang 2" className="index2-subtabs" role="tablist">
                  <button
                    aria-selected={index2Tab === 'form'}
                    className={`index2-tab-pill ${index2Tab === 'form' ? 'is-active' : ''}`}
                    onClick={() => {
                      setIndex2Tab('form')
                      window.location.hash = '#gui-yeu-cau'
                    }}
                    role="tab"
                    type="button"
                  >
                    <Icon name="document" size={18} />
                    <span>Form gửi yêu cầu dịch vụ</span>
                  </button>
                  <button
                    aria-selected={index2Tab === 'tools'}
                    className={`index2-tab-pill ${index2Tab === 'tools' ? 'is-active' : ''}`}
                    onClick={() => {
                      setEstimatorBudget(null)
                      setIndex2Tab('tools')
                      window.location.hash = '#cong-cu'
                    }}
                    role="tab"
                    type="button"
                  >
                    <Icon name="calculator" size={18} />
                    <span>Bộ công cụ học tập miễn phí</span>
                    <span className="tab-pill-badge">Mới</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Display active section or both according to tab */}
            {index2Tab === 'form' ? (
              <div className="tab-content-fade">
                <RequestForm
                  estimatorBudget={estimatorBudget}
                  onServiceChange={setSelectedService}
                  selectedService={selectedService}
                />
              </div>
            ) : (
              <div className="tab-content-fade">
                <StudentToolkit onApplyServiceEstimator={handleApplyFromEstimator} />
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
      <ServiceModal
        onClose={closeModal}
        onSelect={selectService}
        service={activeService}
      />
      <ContactWidget />
    </>
  )
}

export default App
