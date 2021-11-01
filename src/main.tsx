import React from 'react'
import ReactDOM from 'react-dom'
import { loadWASM } from 'onigasm' 
import App from './App'
import './assets/css/tailwind.pcss'
import './assets/css/index.scss'

(async () => {
  await loadWASM('/onigasm.wasm');
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.querySelector('main')
  )
})();