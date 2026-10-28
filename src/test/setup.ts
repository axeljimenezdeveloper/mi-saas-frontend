// src/test/setup.ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Limpia el DOM después de cada test.
// Necesario porque Vitest con globals:false no hace auto-cleanup de RTL.
afterEach(() => {
  cleanup();
});