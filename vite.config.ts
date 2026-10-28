/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: false,               // Usaremos imports explícitos (más limpio)
    environment: 'jsdom',         // Simula el DOM del navegador
    setupFiles: ['./src/test/setup.ts'],
    css: true,                    // Procesa imports de CSS en tests
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/main.tsx',
        'src/vite-env.d.ts',
      ],
    },
  },
});