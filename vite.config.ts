import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Color_Card_List/',
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
});
