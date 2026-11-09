// src/api/auth.ts
// Capa API para /api/auth. Normaliza el UserPublic del backend al User del
// frontend (role uppercase -> lowercase, descarta campos que el frontend no usa).

import { axiosClient, setStoredToken } from './axiosClient';

// ─── Tipos del backend (contrato HTTP) ──────────────────────

interface BackendUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'CASHIER';
  companyId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BackendAuthResponse {
  token: string;
  user: BackendUser;
}

interface ApiResponse<T> {
  success: true;
  data: T;
  error: null;
}

// ─── Tipos del frontend (mismo contrato que authStore) ──────

export interface FrontendUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cashier';
}

// ─── Adapter ────────────────────────────────────────────────

function toFrontendUser(u: BackendUser): FrontendUser {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role === 'ADMIN' ? 'admin' : 'cashier',
  };
}

// ─── Requests ───────────────────────────────────────────────

export async function loginRequest(
  email: string,
  password: string,
): Promise<FrontendUser> {
  const res = await axiosClient.post<ApiResponse<BackendAuthResponse>>(
    '/api/auth/login',
    { email, password },
  );
  const { token, user } = res.data.data;
  setStoredToken(token);
  return toFrontendUser(user);
}

/**
 * Registra un user nuevo y devuelve el user + guarda el token (auto-login).
 * Usado por el boton "Crear cuenta de prueba" del Login.
 */
export async function registerRequest(
  email: string,
  password: string,
  name: string,
): Promise<FrontendUser> {
  const res = await axiosClient.post<ApiResponse<BackendAuthResponse>>(
    '/api/auth/register',
    { email, password, name },
  );
  const { token, user } = res.data.data;
  setStoredToken(token);
  return toFrontendUser(user);
}

export async function meRequest(): Promise<FrontendUser> {
  const res = await axiosClient.get<ApiResponse<BackendUser>>('/api/auth/me');
  return toFrontendUser(res.data.data);
}

export function logoutRequest(): void {
  setStoredToken(null);
}