import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RequestForm } from './RequestForm'
import { submitRequest } from '../lib/submitRequest'

vi.mock('../config/site', () => ({
  siteConfig: {
    appsScriptUrl: 'https://script.google.com/macros/s/example/exec',
    messengerUrl: 'https://m.me/example',
    zaloUrl: 'https://zalo.me/example',
  },
}))

vi.mock('../lib/submitRequest', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/submitRequest')>()
  return { ...actual, submitRequest: vi.fn() }
})

const mockedSubmit = vi.mocked(submitRequest)

async function fillValidForm() {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText(/Họ tên/), 'Nguyễn Văn A')
  await user.type(screen.getByLabelText('Email'), 'student@example.com')
  await user.selectOptions(
    screen.getByLabelText(/Dịch vụ cần hỗ trợ/),
    'bao-cao-tieu-luan',
  )
  await user.type(
    screen.getByLabelText(/Mô tả yêu cầu/),
    'Tôi cần hỗ trợ rà soát và định dạng báo cáo theo rubric của môn học.',
  )
  await user.click(screen.getByLabelText(/Tôi đồng ý với/))
  return user
}

describe('RequestForm', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('giữ nguyên nội dung và cho phép thử kênh khác khi Apps Script lỗi', async () => {
    mockedSubmit.mockRejectedValueOnce(new Error('Dịch vụ tạm thời không phản hồi.'))
    const user = await fillValidFormAfterRender()

    await user.click(screen.getByRole('button', { name: /Gửi yêu cầu/ }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Dịch vụ tạm thời không phản hồi.',
    )
    expect(screen.getByLabelText(/Họ tên/)).toHaveValue('Nguyễn Văn A')
    expect(screen.getByRole('link', { name: 'Thử Zalo' })).toBeInTheDocument()
  })

  it('hiển thị mã yêu cầu khi backend xác nhận thành công', async () => {
    mockedSubmit.mockResolvedValueOnce({ requestId: 'ML-20260930-AB12' })
    const user = await fillValidFormAfterRender()

    await user.click(screen.getByRole('button', { name: /Gửi yêu cầu/ }))

    expect(await screen.findByRole('status')).toHaveTextContent('ML-20260930-AB12')
    expect(screen.getByLabelText(/Họ tên/)).toHaveValue('')
  })
})

async function fillValidFormAfterRender() {
  render(<RequestForm onServiceChange={vi.fn()} selectedService={null} />)
  return fillValidForm()
}
