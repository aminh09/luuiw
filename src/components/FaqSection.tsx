import { faqs } from '../config/content'
import { Icon } from './Icon'
import { SectionHeading } from './SectionHeading'

export function FaqSection() {
  return (
    <section className="section section--tinted" id="faq">
      <div className="container faq-layout">
        <SectionHeading
          eyebrow="Câu hỏi thường gặp"
          title="Thông tin cần biết trước khi gửi yêu cầu"
          description="Nếu chưa tìm thấy câu trả lời, bạn có thể gửi yêu cầu hoặc liên hệ trực tiếp để Luuiw làm rõ."
        />
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>
                <span>{faq.question}</span>
                <Icon name="chevron-down" size={20} />
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
