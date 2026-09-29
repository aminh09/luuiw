import { useCallback, useEffect, useState } from 'react'
import { ContactWidget } from './components/ContactWidget'
import { FaqSection } from './components/FaqSection'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { PolicyView } from './components/PolicyView'
import { PortfolioSection } from './components/PortfolioSection'
import { ProcessSection } from './components/ProcessSection'
import { RequestForm } from './components/RequestForm'
import { ServiceModal } from './components/ServiceModal'
import { ServicesSection } from './components/ServicesSection'
import type { Service } from './types'

type PageView = 'home' | 'privacy' | 'terms'

function getPageView(): PageView {
  if (window.location.hash === '#/privacy') return 'privacy'
  if (window.location.hash === '#/terms') return 'terms'
  return 'home'
}

function App() {
  const [view, setView] = useState<PageView>(getPageView)
  const [activeService, setActiveService] = useState<Service | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  useEffect(() => {
    const onHashChange = () => {
      const nextView = getPageView()
      setView(nextView)
      if (nextView === 'home') {
        window.requestAnimationFrame(() => {
          const id = window.location.hash.slice(1)
          if (id) document.getElementById(id)?.scrollIntoView()
          else window.scrollTo({ top: 0 })
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
    setSelectedService(service)
    setActiveService(null)
    window.requestAnimationFrame(() => {
      document.getElementById('gui-yeu-cau')?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  if (view !== 'home') return <PolicyView type={view} />

  return (
    <>
      <a className="skip-link" href="#main-content">
        Bỏ qua điều hướng
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <ServicesSection
          onOpenDetails={setActiveService}
          onSelect={selectService}
        />
        <PortfolioSection />
        <ProcessSection />

        <RequestForm
          onServiceChange={setSelectedService}
          selectedService={selectedService}
        />
        <FaqSection />
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
