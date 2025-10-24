import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  define: {
    'import.meta.env.VITE_ENOKI_PUBLIC_KEY': JSON.stringify('enoki_public_6e46f0c830405ece028b6c6d7a938b73'),
    'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify('665551195395-qu5pu13dkt5lj3oh0g12u28tks711p3o.apps.googleusercontent.com'),
    'import.meta.env.VITE_BACKEND_URL': JSON.stringify('http://localhost:3001'),
    'import.meta.env.VITE_PACKAGE_ID': JSON.stringify('0xa21bb1d1d4f4ed8a0cb14c1308ef54ec6b15de1ae6a7ada2e8e7dd8982dd33f1'),
  },
});

