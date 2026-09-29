import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const [url, widthArg, heightArg, outputArg] = process.argv.slice(2)
if (!url || !widthArg || !heightArg || !outputArg) {
  throw new Error('Usage: node qa-cdp.mjs <url> <width> <height> <output.png>')
}

const width = Number(widthArg)
const height = Number(heightArg)
const target = await fetch(
  `http://127.0.0.1:9222/json/new?${encodeURIComponent(url)}`,
  { method: 'PUT' },
).then((response) => response.json())

const socket = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((resolveOpen, rejectOpen) => {
  socket.addEventListener('open', resolveOpen, { once: true })
  socket.addEventListener('error', rejectOpen, { once: true })
})

let commandId = 0
const pending = new Map()
const exceptions = []
const errorLogs = []

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data)
  if (message.id && pending.has(message.id)) {
    const { resolve: resolveCommand, reject: rejectCommand } = pending.get(message.id)
    pending.delete(message.id)
    if (message.error) rejectCommand(new Error(message.error.message))
    else resolveCommand(message.result)
    return
  }
  if (message.method === 'Runtime.exceptionThrown') {
    exceptions.push(message.params.exceptionDetails.text)
  }
  if (
    message.method === 'Log.entryAdded' &&
    ['error', 'warning'].includes(message.params.entry.level)
  ) {
    errorLogs.push(message.params.entry.text)
  }
})

function call(method, params = {}) {
  commandId += 1
  return new Promise((resolveCommand, rejectCommand) => {
    pending.set(commandId, { resolve: resolveCommand, reject: rejectCommand })
    socket.send(JSON.stringify({ id: commandId, method, params }))
  })
}

await call('Page.enable')
await call('Runtime.enable')
await call('Log.enable')
await call('Emulation.setDeviceMetricsOverride', {
  width,
  height,
  deviceScaleFactor: 1,
  mobile: true,
})
await call('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 })
await call('Page.navigate', { url })

for (let attempt = 0; attempt < 50; attempt += 1) {
  const ready = await call('Runtime.evaluate', {
    expression: 'document.readyState',
    returnByValue: true,
  })
  if (ready.result.value === 'complete') break
  await new Promise((resolveDelay) => setTimeout(resolveDelay, 100))
}
await new Promise((resolveDelay) => setTimeout(resolveDelay, 500))

const metrics = await call('Runtime.evaluate', {
  expression: `({
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
    title: document.title,
    externalLinkCount: [...document.querySelectorAll('a[href^="http"]')].length,
    unsafeBlankLinks: [...document.querySelectorAll('a[target="_blank"]')]
      .filter((link) => !link.relList.contains('noopener') || !link.relList.contains('noreferrer'))
      .map((link) => link.href),
    missingInternalTargets: [...document.querySelectorAll('a[href^="#"]')]
      .map((link) => link.getAttribute('href'))
      .filter((href) => href && href.length > 1 && !href.startsWith('#/') && !document.querySelector(href))
  })`,
  returnByValue: true,
})
const screenshot = await call('Page.captureScreenshot', {
  format: 'png',
  captureBeyondViewport: false,
  fromSurface: true,
})

const outputPath = resolve(outputArg)
mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(outputPath, Buffer.from(screenshot.data, 'base64'))

console.log(
  JSON.stringify(
    {
      viewport: metrics.result.value,
      exceptions,
      errorLogs,
      screenshot: outputPath,
    },
    null,
    2,
  ),
)
socket.close()
