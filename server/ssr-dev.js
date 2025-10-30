import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  // APIプロキシの設定（シンプルなプロキシ実装）
  app.use('/api/*', async (req, res) => {
    try {
      const apiPath = req.path.replace('/api', '')
      const apiUrl = `http://localhost:8787/api${apiPath}`
      
      console.log(`🔄 Proxying: ${req.method} ${req.originalUrl} -> ${apiUrl}`)
      
      const fetchOptions = {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          ...req.headers
        }
      }
      
      if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
        fetchOptions.body = JSON.stringify(req.body)
      }
      
      const response = await fetch(apiUrl, fetchOptions)
      const contentType = response.headers.get('content-type')
      
      res.status(response.status)
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json()
        res.json(data)
      } else {
        const data = await response.text()
        res.send(data)
      }
    } catch (error) {
      console.log('❌ API proxy error:', error.message)
      res.status(503).json({ error: 'API server not available', details: error.message })
    }
  })

  // Vite開発サーバーを作成
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base: '/'
  })

  // ViteのHTTPミドルウェアを使用（正しい方法）
  app.use(vite.middlewares)

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl

    try {
      // index.htmlテンプレートを取得
      let template = fs.readFileSync(
        path.resolve(__dirname, '../index.html'),
        'utf-8'
      )

      // Viteを使ってHTMLを変換（HMRなどを含む）
      template = await vite.transformIndexHtml(url, template)

      // サーバーエントリーポイントを読み込み
      const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')

      // アプリケーションをHTMLにレンダリング
      const { html: appHtml } = render(url)

      // レンダリングしたHTMLをテンプレートに挿入
      const html = template.replace(`<!--ssr-outlet-->`, appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      // エラーが発生した場合、Viteがスタックトレースを修正して再スロー
      vite.ssrFixStacktrace(e)
      next(e)
    }
  })

  const port = process.env.SSR_PORT || 3000
  
  app.listen(port, () => {
    console.log(`🚀 SSR Server running at http://localhost:${port}`)
    console.log(`📡 API Proxy: /api -> http://localhost:8787`)
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${port} is already in use. Please stop other services or change SSR_PORT.`)
    } else {
      console.error('❌ Server error:', err)
    }
    process.exit(1)
  })
}

createServer().catch(err => {
  console.error('❌ Failed to create SSR server:', err)
  process.exit(1)
})