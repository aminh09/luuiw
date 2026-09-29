import type { PortfolioKind } from '../types'

export function PortfolioVisual({ kind }: { kind: PortfolioKind }) {
  if (kind === 'document') {
    return (
      <div className="portfolio-art document-art" aria-hidden="true">
        <div className="paper">
          <span className="paper-kicker" />
          <strong />
          <i />
          <i />
          <i className="short" />
          <div className="paper-chart"><b /><b /><b /><b /></div>
        </div>
      </div>
    )
  }
  if (kind === 'slides') {
    return (
      <div className="portfolio-art slides-art" aria-hidden="true">
        <div className="slide-main">
          <span>01</span><strong /><i /><div><b /><b /><b /></div>
        </div>
        <div className="slide-side"><i /><i /><i /></div>
      </div>
    )
  }
  if (kind === 'diagram') {
    return (
      <div className="portfolio-art diagram-art" aria-hidden="true">
        <span className="node node--one">User</span>
        <span className="node node--two">Service</span>
        <span className="node node--three">Data</span>
        <i className="connector connector--one" />
        <i className="connector connector--two" />
      </div>
    )
  }
  if (kind === 'website') {
    return (
      <div className="portfolio-art website-art" aria-hidden="true">
        <div className="browser-bar"><i /><i /><i /><span /></div>
        <div className="web-layout"><aside /><main><b /><i /><div><span /><span /><span /></div></main></div>
      </div>
    )
  }
  if (kind === 'resume') {
    return (
      <div className="portfolio-art resume-art" aria-hidden="true">
        <div className="resume-page">
          <aside><span /><i /><i /><i /></aside>
          <main><strong /><small /><i /><i /><b /><i /><i /></main>
        </div>
      </div>
    )
  }
  return (
    <div className="portfolio-art sheet-art" aria-hidden="true">
      <div className="sheet-table">
        {Array.from({ length: 24 }, (_, index) => <i key={index} />)}
      </div>
      <div className="sheet-chart"><b /><b /><b /><b /><b /></div>
    </div>
  )
}
