import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    window.location.hash = ''
    localStorage.clear()
  })

  it('hiển thị trang chủ và toàn bộ dịch vụ', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Hỗ trợ học tập và sản phẩm số dành cho sinh viên.',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('13 dịch vụ phù hợp')).toBeInTheDocument()
  })

  it('tìm dịch vụ và mở, đóng chi tiết bằng bàn phím', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByRole('searchbox'), 'MongoDB')
    const serviceHeading = screen.getByRole('heading', {
      name: 'SQL Server, MySQL và MongoDB',
    })
    expect(serviceHeading).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Báo cáo và tiểu luận' }),
    ).not.toBeInTheDocument()

    const card = serviceHeading.closest('article')
    expect(card).not.toBeNull()
    await user.click(within(card!).getByRole('button', { name: 'Xem chi tiết' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('mở khu vực chính sách quyền riêng tư', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('link', { name: 'Chính sách quyền riêng tư' }))
    expect(
      await screen.findByRole('heading', { name: 'Chính sách quyền riêng tư' }),
    ).toBeInTheDocument()
  })

  it('chọn dịch vụ vào form và dùng fallback khi Apps Script chưa cấu hình', async () => {
    const user = userEvent.setup()
    render(<App />)

    const card = screen
      .getByRole('heading', { name: 'Báo cáo và tiểu luận' })
      .closest('article')
    await user.click(within(card!).getByRole('button', { name: 'Chọn dịch vụ' }))

    expect(screen.getByLabelText(/Dịch vụ cần hỗ trợ/)).toHaveValue(
      'bao-cao-tieu-luan',
    )
    expect(
      screen.getByRole('link', { name: /Gửi yêu cầu qua Messenger/ }),
    ).toHaveAttribute('target', '_blank')
  })

  it('mở menu và đóng bảng liên hệ bằng Escape', async () => {
    const user = userEvent.setup()
    render(<App />)

    const menuButton = screen.getByRole('button', { name: 'Mở menu' })
    await user.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')

    await user.click(screen.getByRole('button', { name: 'Mở lựa chọn liên hệ' }))
    expect(screen.getByRole('link', { name: /Gửi yêu cầu mới/ })).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('link', { name: /Gửi yêu cầu mới/ })).not.toBeInTheDocument()
  })
})
