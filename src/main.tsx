import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastProvider } from './components/feedback/alerts/Toast';
import { AuthProvider } from './context';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ToastProvider>
  </StrictMode>
);
