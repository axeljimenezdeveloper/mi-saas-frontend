// src/api/axiosClient.ts
// Cliente Axios configurado para la API de Vendra.
// - baseURL: API_BASE_URL (default http://localhost:3000)
// - request interceptor: adjunta Authorization: Bearer <token> si existe
// - response interceptor: si recibe 401, invoca el handler registrado
//   (authStore lo registra con setUnauthorizedHandler para hacer logout).

import axios from 'axios';
import { API_BASE_URL, TOKEN_STORAGE_KEY } from '../config/backend';

let unauthorizedHandler: (() => void) | null = null;

/** Registra el handler que se invoca cuando la API responde 401. */
export function setUnauthorizedHandler(fn: () => void): void {
  unauthorizedHandler = fn;
}

/** Lee el JWT actual desde localStorage. */
export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Persiste el JWT en localStorage. */
export function setStoredToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {
    // localStorage puede fallar en modo incognito / quota. Silencioso.
  }
}

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

axiosClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Solo dispara logout en 401 con token presente (evita loop en /login fallido)
    if (error?.response?.status === 401 && getStoredToken()) {
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  },
);