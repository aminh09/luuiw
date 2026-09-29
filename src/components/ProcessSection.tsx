import { processSteps } from '../config/content'
import { SectionHeading } from './SectionHeading'

export function ProcessSection() {
  return (
    <section className="section process-section" id="quy-trinh">
      <div className="container">
        <SectionHeading
          align="center"
          eyebrow="Quy trình"
          title="Rõ từng bước, thống nhất trước khi làm"
          description="Luuiw chỉ bắt đầu sau khi hai bên hiểu giống nhau về đầu việc, thời gian, chi phí và cách phản hồi."
        />
        <ol className="process-list">
          {processSteps.map((step, index) => (
            <li key={step.title}>
              <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
