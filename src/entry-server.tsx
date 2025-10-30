import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { I18nextProvider } from 'react-i18next'
import App from './App'
import i18n from './i18n'

export function render(url: string, context?: any) {
  // i18nextの初期化（必要に応じて言語を設定）
  const lng = context?.language || 'ja'
  i18n.changeLanguage(lng)

  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <I18nextProvider i18n={i18n}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </I18nextProvider>
    </React.StrictMode>
  )
  return { html }
}