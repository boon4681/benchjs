import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const prefix = `monaco-editor/esm/vs`;
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()]
})
