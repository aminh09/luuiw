import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StudentToolkit } from './StudentToolkit'

describe('StudentToolkit', () => {
  it('rà soát nội bộ, không giả định điểm Turnitin hay phần trăm nguyên bản', async () => {
    const user = userEvent.setup()
    render(<StudentToolkit />)
    expect(screen.getByLabelText(/Nội dung bài viết cần kiểm tra/)).toHaveValue('')
    await user.type(
      screen.getByLabelText(/Nội dung bài viết cần kiểm tra/),
      'Trong bối cảnh hội nhập quốc tế, chúng ta cần xem xét đề tài trong bối cảnh thực tế.',
    )
    await user.click(screen.getByRole('button', { name: 'Rà soát văn bản' }))
    expect(screen.getByText('Kết quả rà soát nội dung (nội bộ)')).toBeInTheDocument()
    expect(screen.getByText(/Không có điểm phần trăm tương đồng/)).toBeInTheDocument()
    expect(screen.queryByText(/Đạt ngưỡng an toàn/)).not.toBeInTheDocument()
  })

  it('không giả quy đổi hệ 10 từ GPA chữ và bắt buộc nguồn thật để tạo trích dẫn', async () => {
    const user = userEvent.setup()
    render(<StudentToolkit />)
    await user.click(screen.getByRole('tab', { name: /Tính GPA/ }))
    expect(screen.getByText('Chưa đủ dữ liệu')).toBeInTheDocument()
    await user.click(screen.getByRole('tab', { name: /Tạo trích dẫn/ }))
    expect(screen.getByText(/Nhập tác giả, năm, tiêu đề và tên nguồn thật/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sao chép trích dẫn' })).toBeDisabled()
  })
})
