// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',  // assuming you serve at the root domain
  build: {
    outDir: 'dist',
    // optionally set other options
  },
});
