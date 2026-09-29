import { emptyRequestForm } from './formValidation'
import { SubmissionError, submitRequest } from './submitRequest'

describe('submitRequest', () => {
  beforeEach(() => {
    vi.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation(() => {})
  })

  it('chỉ hoàn tất sau phản hồi hợp lệ từ Apps Script', async () => {
    const promise = submitRequest(
      'https://script.google.com/macros/s/example/exec',
      {
        ...emptyRequestForm,
        fullName: 'Anh Minh',
        email: 'student@example.com',
      },
      1000,
    )

    const tokenInput = document.querySelector<HTMLInputElement>(
      'form input[name="requestToken"]',
    )
    expect(tokenInput).not.toBeNull()

    window.dispatchEvent(
      new MessageEvent('message', {
        origin: 'https://script.google.com',
        data: {
          type: 'luuiw-form-response',
          requestToken: tokenInput!.value,
          ok: true,
          requestId: 'ML-20260930-AB12',
        },
      }),
    )

    await expect(promise).resolves.toEqual({ requestId: 'ML-20260930-AB12' })
    expect(document.querySelector('form')).toBeNull()
  })

  it('bỏ qua phản hồi từ origin không tin cậy và hết thời gian', async () => {
    vi.useFakeTimers()
    const promise = submitRequest(
      'https://script.google.com/macros/s/example/exec',
      { ...emptyRequestForm },
      100,
    )
    const token = document.querySelector<HTMLInputElement>(
      'form input[name="requestToken"]',
    )!.value

    window.dispatchEvent(
      new MessageEvent('message', {
        origin: 'https://example.com',
        data: {
          type: 'luuiw-form-response',
          requestToken: token,
          ok: true,
          requestId: 'FAKE',
        },
      }),
    )
    const rejection = expect(promise).rejects.toBeInstanceOf(SubmissionError)
    await vi.advanceTimersByTimeAsync(101)
    await rejection
    vi.useRealTimers()
  })

  it('từ chối endpoint không an toàn', async () => {
    await expect(
      submitRequest('http://example.com', { ...emptyRequestForm }),
    ).rejects.toBeInstanceOf(SubmissionError)
  })
})
