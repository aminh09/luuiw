export interface RequestFormData {
  fullName: string
  email: string
  phone: string
  service: string
  subject: string
  description: string
  deadline: string
  budget: string
  preferredContact: string
  attachmentUrl: string
  consent: boolean
  website: string
}

export type FormField = keyof RequestFormData
export type FormErrors = Partial<Record<FormField, string>>

export const emptyRequestForm: RequestFormData = {
  fullName: '',
  email: '',
  phone: '',
  service: '',
  subject: '',
  description: '',
  deadline: '',
  budget: '',
  preferredContact: 'Messenger',
  attachmentUrl: '',
  consent: false,
  website: '',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[+\d][\d\s().-]{7,19}$/

export function getTodayLocal(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

export function validateRequestForm(data: RequestFormData): FormErrors {
  const errors: FormErrors = {}
  const fullName = data.fullName.trim()
  const email = data.email.trim()
  const phone = data.phone.trim()
  const description = data.description.trim()

  if (!fullName) errors.fullName = 'Vui lòng nhập họ tên.'
  else if (fullName.length < 2) errors.fullName = 'Họ tên cần có ít nhất 2 ký tự.'
  else if (fullName.length > 100) errors.fullName = 'Họ tên không vượt quá 100 ký tự.'

  if (!email && !phone) {
    const message = 'Vui lòng nhập ít nhất email hoặc số điện thoại.'
    errors.email = message
    errors.phone = message
  }
  if (email && !emailPattern.test(email)) errors.email = 'Email chưa đúng định dạng.'
  if (phone && !phonePattern.test(phone)) errors.phone = 'Số điện thoại chưa đúng định dạng.'

  if (!data.service) errors.service = 'Vui lòng chọn dịch vụ cần hỗ trợ.'
  if (data.subject.length > 150) errors.subject = 'Chủ đề không vượt quá 150 ký tự.'

  if (!description) errors.description = 'Vui lòng mô tả yêu cầu.'
  else if (description.length < 30) {
    errors.description = 'Hãy mô tả ít nhất 30 ký tự để Luuiw hiểu yêu cầu.'
  } else if (description.length > 3000) {
    errors.description = 'Mô tả không vượt quá 3.000 ký tự.'
  }

  if (data.deadline && data.deadline < getTodayLocal()) {
    errors.deadline = 'Thời hạn không được ở trong quá khứ.'
  }

  if (data.budget.length > 100) errors.budget = 'Ngân sách không vượt quá 100 ký tự.'
  if (!data.preferredContact) {
    errors.preferredContact = 'Vui lòng chọn phương thức liên hệ.'
  }

  if (data.attachmentUrl && !isValidHttpUrl(data.attachmentUrl)) {
    errors.attachmentUrl = 'Đường dẫn phải bắt đầu bằng http:// hoặc https://.'
  }

  if (!data.consent) errors.consent = 'Bạn cần đồng ý với chính sách quyền riêng tư.'
  return errors
}
