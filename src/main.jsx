import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

document.dispatchEvent(new Event('prerender-ready'))
