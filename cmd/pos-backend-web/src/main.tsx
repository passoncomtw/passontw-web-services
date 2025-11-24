// 應用程式主要進入點

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// 建立根元素
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

// 渲染應用程式
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
