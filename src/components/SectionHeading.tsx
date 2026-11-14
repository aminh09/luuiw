interface SectionHeadingProps {
  eyebrow: string
  title: string
  description: string
  badge?: string
  align?: 'left' | 'center'
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  badge,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      <div className="eyebrow-row">
        <p className="eyebrow">{eyebrow}</p>
        {badge && <span className="section-badge">{badge}</span>}
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}
