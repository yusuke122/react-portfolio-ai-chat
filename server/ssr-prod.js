import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import compression from 'compression'
import sirv from 'sirv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'

// キャッシュされたプロダクションアセット
const templateHtml = isProduction
  ? fs.readFileSync(path.resolve(__dirname, '../dist/client/index.html'), 'utf-8')
  : ''
const ssrManifest = isProduction
  ? fs.readFileSync(path.resolve(__dirname, '../dist/client/ssr-manifest.json'), 'utf-8')
  : undefined

const app = express()

// 圧縮ミドルウェア
app.use(compression())

// API routes - 本番環境では通常は別のサーバーにプロキシまたは直接処理
app.use('/api', (req, res) => {
  res.status(503).json({ 
    error: 'API not configured in production. Please set up API endpoints.' 
  })
})

// 静的ファイルの配信
if (isProduction) {
  app.use(base, sirv(path.resolve(__dirname, '../dist/client'), {
    extensions: []
  }))
} else {
  const { createServer } = await import('vite')
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base
  })
  app.use(vite.ssrLoadModule)
}

app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')

    let template
    let render
    if (!isProduction) {
      // 開発環境: 常にHTMLを再読み込み
      template = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
    } else {
      // 本番環境: キャッシュされたテンプレートとレンダラーを使用
      template = templateHtml
      render = (await import(path.resolve(__dirname, '../dist/server/entry-server.js'))).render
    }

    const { html: appHtml } = render(url, {
      language: req.acceptsLanguages(['ja', 'en']) || 'ja'
    })

    const html = template.replace(`<!--ssr-outlet-->`, appHtml)

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
  } catch (e) {
    if (!isProduction) {
      vite.ssrFixStacktrace(e)
    }
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

app.listen(port, () => {
  console.log(`🚀 Server started at http://localhost:${port}`)
})