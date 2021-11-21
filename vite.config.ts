import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import md from './plugin/mdloader'

export default defineConfig({
  plugins: [md(),react()]
})
