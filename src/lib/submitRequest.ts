import type { RequestFormData } from './formValidation'

export interface SubmitResult {
  requestId: string
}

interface AppsScriptMessage {
  type: 'luuiw-form-response'
  requestToken: string
  ok: boolean
  requestId?: string
  message?: string
}

export class SubmissionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SubmissionError'
  }
}

function createRequestToken(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function isAllowedAppsScriptOrigin(origin: string): boolean {
  try {
    const hostname = new URL(origin).hostname
    return (
      hostname === 'script.google.com' ||
      hostname === 'script.googleusercontent.com' ||
      hostname.endsWith('.googleusercontent.com')
    )
  } catch {
    return false
  }
}

export function submitRequest(
  endpoint: string,
  data: RequestFormData,
  timeoutMs = 25_000,
): Promise<SubmitResult> {
  if (!endpoint || !/^https:\/\//i.test(endpoint)) {
    return Promise.reject(new SubmissionError('Endpoint nhận yêu cầu chưa hợp lệ.'))
  }

  return new Promise((resolve, reject) => {
    const requestToken = createRequestToken()
    const frameName = `luuiw-submit-${requestToken.replace(/[^a-z0-9]/gi, '')}`
    const iframe = document.createElement('iframe')
    const form = document.createElement('form')
    let settled = false

    iframe.name = frameName
    iframe.title = 'Kết quả gửi yêu cầu'
    iframe.hidden = true
    form.method = 'POST'
    form.action = endpoint
    form.target = frameName
    form.hidden = true

    const payload: Record<string, string> = {
      ...Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, String(value)]),
      ),
      requestToken,
      source: 'luuiw-website',
      userAgent: navigator.userAgent.slice(0, 300),
    }

    for (const [name, value] of Object.entries(payload)) {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = name
      input.value = value
      form.appendChild(input)
    }

    const cleanup = () => {
      window.removeEventListener('message', onMessage)
      window.clearTimeout(timeout)
      form.remove()
      iframe.remove()
    }

    const finish = (callback: () => void) => {
      if (settled) return
      settled = true
      cleanup()
      callback()
    }

    const onMessage = (event: MessageEvent<unknown>) => {
      if (!isAllowedAppsScriptOrigin(event.origin)) return
      if (!event.data || typeof event.data !== 'object') return
      const message = event.data as Partial<AppsScriptMessage>
      if (
        message.type !== 'luuiw-form-response' ||
        message.requestToken !== requestToken
      ) {
        return
      }

      if (message.ok && message.requestId) {
        finish(() => resolve({ requestId: message.requestId! }))
      } else {
        finish(() =>
          reject(
            new SubmissionError(
              message.message || 'Hệ thống chưa thể tiếp nhận yêu cầu.',
            ),
          ),
        )
      }
    }

    const timeout = window.setTimeout(() => {
      finish(() =>
        reject(
          new SubmissionError(
            'Không nhận được xác nhận từ hệ thống. Nội dung của bạn vẫn được giữ lại.',
          ),
        ),
      )
    }, timeoutMs)

    window.addEventListener('message', onMessage)
    document.body.append(iframe, form)
    form.submit()
  })
}
