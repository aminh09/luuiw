import { useEffect, useMemo, useState } from 'react'
import { services } from '../config/services'
import { siteConfig } from '../config/site'
import {
  emptyRequestForm,
  getTodayLocal,
  validateRequestForm,
  type FormErrors,
  type FormField,
  type RequestFormData,
} from '../lib/formValidation'
import { submitRequest } from '../lib/submitRequest'
import type { Service } from '../types'
import { Icon } from './Icon'
import { SectionHeading } from './SectionHeading'

const DRAFT_KEY = 'luuiw-request-draft-v1'

interface RequestFormProps {
  selectedService: Service | null
  onServiceChange: (service: Service | null) => void
}

type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; requestId: string }
  | { status: 'error'; message: string }

function loadDraft(): RequestFormData {
  try {
    const saved = localStorage.getItem(DRAFT_KEY)
    if (!saved) return { ...emptyRequestForm }
    const parsed = JSON.parse(saved) as Partial<RequestFormData>
    return { ...emptyRequestForm, ...parsed, consent: false, website: '' }
  } catch {
    return { ...emptyRequestForm }
  }
}

export function RequestForm({
  selectedService,
  onServiceChange,
}: RequestFormProps) {
  const [data, setData] = useState<RequestFormData>(loadDraft)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle' })
  const isConfigured = Boolean(siteConfig.appsScriptUrl)

  const effectiveService = selectedService?.id ?? data.service
  const effectiveData = useMemo(
    () => ({ ...data, service: effectiveService }),
    [data, effectiveService],
  )

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const hasDraft = Boolean(
        data.fullName || data.email || data.phone || effectiveService ||
          data.subject || data.description || data.deadline || data.budget ||
          data.attachmentUrl,
      )
      if (hasDraft) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(effectiveData))
      }
      else localStorage.removeItem(DRAFT_KEY)
    }, 300)
    return () => window.clearTimeout(timer)
  }, [data, effectiveData, effectiveService])

  const selectedServiceName = useMemo(
    () => services.find((service) => service.id === effectiveService)?.name,
    [effectiveService],
  )

  const setField = <K extends FormField>(field: K, value: RequestFormData[K]) => {
    const nextData = { ...data, [field]: value }
    setData(nextData)
    if (errors[field]) {
      setErrors((current) => ({
        ...current,
        [field]: validateRequestForm({
          ...nextData,
          service:
            field === 'service'
              ? String(value)
              : selectedService?.id ?? nextData.service,
        })[field],
      }))
    }
    if (submitState.status !== 'idle' && submitState.status !== 'submitting') {
      setSubmitState({ status: 'idle' })
    }
  }

  const validateField = (field: FormField) => {
    setErrors((current) => ({
      ...current,
      [field]: validateRequestForm(effectiveData)[field],
    }))
  }

  const getErrorProps = (field: FormField) => ({
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `${field}-error` : undefined,
  })

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isConfigured || submitState.status === 'submitting') return

    const nextErrors = validateRequestForm(effectiveData)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      window.requestAnimationFrame(() => {
        event.currentTarget
          .querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus()
      })
      return
    }

    setSubmitState({ status: 'submitting' })
    try {
      const result = await submitRequest(siteConfig.appsScriptUrl, {
        ...effectiveData,
        service: selectedServiceName ?? effectiveData.service,
      })
      setSubmitState({ status: 'success', requestId: result.requestId })
      setErrors({})
      setData({ ...emptyRequestForm })
      onServiceChange(null)
      localStorage.removeItem(DRAFT_KEY)
    } catch (error) {
      setSubmitState({
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Không thể gửi yêu cầu. Nội dung của bạn vẫn được giữ lại.',
      })
    }
  }

  return (
    <section className="section request-section" id="gui-yeu-cau">
      <div className="container request-layout">
        <div className="request-intro">
          <SectionHeading
            eyebrow="Gửi yêu cầu"
            title="Cho Luuiw biết bạn đang cần gì"
            description="Thông tin càng rõ, việc kiểm tra phạm vi và phản hồi ban đầu càng nhanh. Bạn chưa cần gửi file riêng ngay tại đây."
          />
          <div className="request-side-card">
            <Icon name="shield" size={22} />
            <div>
              <strong>Tài liệu được xem là riêng tư</strong>
              <p>Hãy dùng link có quyền truy cập phù hợp. File riêng có thể gửi sau qua Zalo hoặc Messenger.</p>
            </div>
          </div>
          <div className="request-side-card">
            <Icon name="clock" size={22} />
            <div>
              <strong>Phản hồi trong khung 8:00–24:00</strong>
              <p>Luuiw sẽ đọc yêu cầu trước khi trao đổi phạm vi, thời gian và báo giá cụ thể.</p>
            </div>
          </div>
        </div>

        <form className="request-form" noValidate onSubmit={onSubmit}>
          {selectedServiceName && (
            <div className="selected-service-note">
              <Icon name="check" size={18} />
              <span>Đã chọn: <strong>{selectedServiceName}</strong></span>
            </div>
          )}

          {submitState.status === 'success' && (
            <div className="form-status form-status--success" role="status">
              <Icon name="check" size={22} />
              <div>
                <strong>Luuiw đã tiếp nhận yêu cầu</strong>
                <p>Mã yêu cầu: <b>{submitState.requestId}</b>. Hãy lưu mã này và kiểm tra email nếu bạn đã cung cấp địa chỉ email.</p>
              </div>
            </div>
          )}

          {submitState.status === 'error' && (
            <div className="form-status form-status--error" role="alert">
              <Icon name="close" size={21} />
              <div>
                <strong>Chưa gửi được yêu cầu</strong>
                <p>{submitState.message}</p>
                <div className="status-links">
                  <a href={siteConfig.zaloUrl} rel="noopener noreferrer" target="_blank">Thử Zalo</a>
                  <a href={siteConfig.messengerUrl} rel="noopener noreferrer" target="_blank">Thử Messenger</a>
                </div>
              </div>
            </div>
          )}

          <div className="form-grid">
            <div className="field">
              <label htmlFor="fullName">Họ tên <span aria-hidden="true">*</span></label>
              <input {...getErrorProps('fullName')} autoComplete="name" id="fullName" maxLength={100} onBlur={() => validateField('fullName')} onChange={(event) => setField('fullName', event.target.value)} placeholder="Nguyễn Văn A" value={data.fullName} />
              {errors.fullName && <span className="field-error" id="fullName-error">{errors.fullName}</span>}
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input {...getErrorProps('email')} autoComplete="email" id="email" maxLength={150} onBlur={() => validateField('email')} onChange={(event) => setField('email', event.target.value)} placeholder="ban@example.com" type="email" value={data.email} />
              {errors.email && <span className="field-error" id="email-error">{errors.email}</span>}
            </div>

            <div className="field">
              <label htmlFor="phone">Số điện thoại</label>
              <input {...getErrorProps('phone')} autoComplete="tel" id="phone" maxLength={20} onBlur={() => validateField('phone')} onChange={(event) => setField('phone', event.target.value)} placeholder="0986 876 541" type="tel" value={data.phone} />
              {errors.phone && <span className="field-error" id="phone-error">{errors.phone}</span>}
            </div>

            <div className="field">
              <label htmlFor="service">Dịch vụ cần hỗ trợ <span aria-hidden="true">*</span></label>
              <select
                {...getErrorProps('service')}
                id="service"
                onBlur={() => validateField('service')}
                onChange={(event) => {
                  const value = event.target.value
                  setField('service', value)
                  onServiceChange(
                    services.find((service) => service.id === value) ?? null,
                  )
                }}
                value={effectiveService}
              >
                <option value="">Chọn một dịch vụ</option>
                {services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
              </select>
              {errors.service && <span className="field-error" id="service-error">{errors.service}</span>}
            </div>

            <div className="field field--wide">
              <label htmlFor="subject">Môn học hoặc chủ đề</label>
              <input {...getErrorProps('subject')} id="subject" maxLength={150} onBlur={() => validateField('subject')} onChange={(event) => setField('subject', event.target.value)} placeholder="Ví dụ: Hệ quản trị cơ sở dữ liệu" value={data.subject} />
              {errors.subject && <span className="field-error" id="subject-error">{errors.subject}</span>}
            </div>

            <div className="field field--wide">
              <div className="label-row">
                <label htmlFor="description">Mô tả yêu cầu <span aria-hidden="true">*</span></label>
                <span>{data.description.length}/3000</span>
              </div>
              <textarea {...getErrorProps('description')} id="description" maxLength={3000} onBlur={() => validateField('description')} onChange={(event) => setField('description', event.target.value)} placeholder="Mô tả đề bài, phần bạn đã làm, kết quả mong muốn và yêu cầu định dạng..." rows={6} value={data.description} />
              {errors.description && <span className="field-error" id="description-error">{errors.description}</span>}
            </div>

            <div className="field">
              <label htmlFor="deadline">Thời hạn cần hoàn thành</label>
              <input {...getErrorProps('deadline')} id="deadline" min={getTodayLocal()} onBlur={() => validateField('deadline')} onChange={(event) => setField('deadline', event.target.value)} type="date" value={data.deadline} />
              {errors.deadline && <span className="field-error" id="deadline-error">{errors.deadline}</span>}
            </div>

            <div className="field">
              <label htmlFor="budget">Ngân sách dự kiến</label>
              <input {...getErrorProps('budget')} id="budget" maxLength={100} onBlur={() => validateField('budget')} onChange={(event) => setField('budget', event.target.value)} placeholder="Có thể ghi: chưa xác định" value={data.budget} />
              {errors.budget && <span className="field-error" id="budget-error">{errors.budget}</span>}
            </div>

            <div className="field">
              <label htmlFor="preferredContact">Muốn được liên hệ qua</label>
              <select {...getErrorProps('preferredContact')} id="preferredContact" onChange={(event) => setField('preferredContact', event.target.value)} value={data.preferredContact}>
                <option>Messenger</option><option>Zalo</option><option>Email</option><option>Điện thoại</option>
              </select>
              {errors.preferredContact && <span className="field-error" id="preferredContact-error">{errors.preferredContact}</span>}
            </div>

            <div className="field">
              <label htmlFor="attachmentUrl">Link Google Drive/Figma/tài liệu</label>
              <input {...getErrorProps('attachmentUrl')} id="attachmentUrl" maxLength={500} onBlur={() => validateField('attachmentUrl')} onChange={(event) => setField('attachmentUrl', event.target.value)} placeholder="https://..." type="url" value={data.attachmentUrl} />
              {errors.attachmentUrl && <span className="field-error" id="attachmentUrl-error">{errors.attachmentUrl}</span>}
            </div>
          </div>

          <div className="honeypot" aria-hidden="true">
            <label htmlFor="website">Không điền trường này</label>
            <input autoComplete="off" id="website" name="website" onChange={(event) => setField('website', event.target.value)} tabIndex={-1} value={data.website} />
          </div>

          <div className="consent-field">
            <input {...getErrorProps('consent')} checked={data.consent} id="consent" onChange={(event) => setField('consent', event.target.checked)} type="checkbox" />
            <label htmlFor="consent">Tôi đồng ý với <a href="#/privacy">chính sách quyền riêng tư</a> và cho phép Luuiw liên hệ về yêu cầu này.</label>
          </div>
          {errors.consent && <span className="field-error consent-error" id="consent-error">{errors.consent}</span>}

          {isConfigured ? (
            <button className="button button--primary submit-button" disabled={submitState.status === 'submitting'} type="submit">
              {submitState.status === 'submitting' ? <><span className="spinner" aria-hidden="true" /> Đang gửi yêu cầu...</> : <>Gửi yêu cầu <Icon name="send" size={18} /></>}
            </button>
          ) : (
            <div className="unconfigured-submit">
              <p>Form trực tuyến đang chờ cấu hình Google Apps Script. Nội dung bạn nhập được lưu trên thiết bị này; hãy gửi yêu cầu trực tiếp qua Messenger trong thời gian chờ.</p>
              <a className="button button--primary submit-button" href={siteConfig.messengerUrl} rel="noopener noreferrer" target="_blank">
                Gửi yêu cầu qua Messenger <Icon name="external" size={17} />
              </a>
            </div>
          )}
          <p className="form-footnote">Website không tải file trực tiếp. Không gửi mật khẩu, thông tin tài chính hoặc dữ liệu nhạy cảm trong mô tả.</p>
        </form>
      </div>
    </section>
  )
}
