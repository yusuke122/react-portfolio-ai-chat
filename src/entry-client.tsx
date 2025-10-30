import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import App from './App'
import i18n from './i18n'
import './styles/index.scss'

const container = document.getElementById('root')!

const AppComponent = (
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </I18nextProvider>
  </React.StrictMode>
)

// SSRかどうかを判定してhydrateまたはrenderを使い分け
if (container.hasChildNodes()) {
  // SSRでレンダリングされたHTMLが存在する場合はhydrate
  ReactDOM.hydrateRoot(container, AppComponent)
} else {
  // SPAとして新規レンダリングの場合はcreateRoot
  ReactDOM.createRoot(container).render(AppComponent)
}