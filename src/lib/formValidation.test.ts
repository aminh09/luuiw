import {
  emptyRequestForm,
  getTodayLocal,
  isValidHttpUrl,
  validateRequestForm,
  type RequestFormData,
} from './formValidation'

function validData(): RequestFormData {
  return {
    ...emptyRequestForm,
    fullName: 'Nguyễn Văn A',
    email: 'student@example.com',
    service: 'bao-cao-tieu-luan',
    description:
      'Tôi cần hỗ trợ rà soát bố cục và định dạng báo cáo theo rubric của môn học.',
    consent: true,
  }
}

describe('validateRequestForm', () => {
  it('chấp nhận dữ liệu hợp lệ', () => {
    expect(validateRequestForm(validData())).toEqual({})
  })

  it('yêu cầu họ tên, một kênh liên hệ, dịch vụ, mô tả và đồng ý chính sách', () => {
    const errors = validateRequestForm({ ...emptyRequestForm })

    expect(errors.fullName).toBeDefined()
    expect(errors.email).toBeDefined()
    expect(errors.phone).toBeDefined()
    expect(errors.service).toBeDefined()
    expect(errors.description).toBeDefined()
    expect(errors.consent).toBeDefined()
  })

  it('phát hiện email, điện thoại, URL và ngày quá khứ không hợp lệ', () => {
    const errors = validateRequestForm({
      ...validData(),
      email: 'email-sai',
      phone: '123',
      attachmentUrl: 'khong-phai-url',
      deadline: '2000-01-01',
    })

    expect(errors.email).toBe('Email chưa đúng định dạng.')
    expect(errors.phone).toBe('Số điện thoại chưa đúng định dạng.')
    expect(errors.attachmentUrl).toBeDefined()
    expect(errors.deadline).toBeDefined()
  })

  it('cho phép dùng số điện thoại thay cho email', () => {
    const data = validData()
    data.email = ''
    data.phone = '0986 876 541'

    expect(validateRequestForm(data).email).toBeUndefined()
    expect(validateRequestForm(data).phone).toBeUndefined()
  })
})

describe('URL và ngày', () => {
  it('chỉ nhận URL HTTP(S)', () => {
    expect(isValidHttpUrl('https://drive.google.com/file/123')).toBe(true)
    expect(isValidHttpUrl('javascript:alert(1)')).toBe(false)
  })

  it('trả ngày địa phương dạng YYYY-MM-DD', () => {
    expect(getTodayLocal()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
