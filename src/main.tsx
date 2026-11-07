import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastViewport } from './components/feedback/alerts/Toast';
import { ErrorBoundary } from './components/feedback/errors/ErrorBoundary';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ToastViewport />
      <App />
    </ErrorBoundary>
  </StrictMode>
);
