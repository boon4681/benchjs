import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import md from './plugin/mdloader'
import pluginRewriteAll from 'vite-plugin-rewrite-all';
import { dependencies } from './package.json';

function renderChunks(deps: Record<string, string>) {
  let chunks = {};
  Object.keys(deps).forEach((key) => {
    if (key.startsWith('react')) chunks['vendor.a'] = [key];
    else if (key.startsWith('monaco')) chunks['vendor.b'] = [key];
    else
      chunks["vendor.c"] = [key];
  });
  return chunks;
}

export default defineConfig({
  plugins: [md(), react(), pluginRewriteAll()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          ...renderChunks(dependencies),
        }
      }
    }
  }
})
