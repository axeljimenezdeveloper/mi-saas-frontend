// src/api/notifications.ts
// Capa API para /api/notifications. Adapter entre NotificationPublic (backend)
// y AppNotification (frontend).
//
// Diferencias clave:
//   - createdAt: string ISO  <->  timestamp: number
//   - category: 'system'|'inventory'|'billing'|'auth'  (mismo formato)
//   - variant: no existe en backend  ->  se deriva del title
//   - read: boolean (mismo formato)

import { axiosClient } from './axiosClient';
import type {
  AppNotification,
  NotificationCategory,
  NotificationVariant,
} from '../stores/notificationsStore';

// ─── Tipos del backend (contrato HTTP) ──────────────────────

interface BackendNotification {
  id: string;
  userId: string;
  companyId: string;
  category: string;
  title: string;
  description: string | null;
  actionUrl: string | null;
  read: boolean;
  createdAt: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

interface ApiResponse<T> {
  success: true;
  data: T;
  error: null;
}

interface ListNotificationsQuery {
  page?: number;
  pageSize?: number;
  read?: boolean;
  category?: NotificationCategory;
}

// ─── Adapter ────────────────────────────────────────────────

/**
 * Deriva el variant (icono + color) del title porque el backend no lo guarda.
 * Reglas simples orientadas al MVP:
 *   - "pagada" / "bienvenido" / "correctamente" -> success (verde)
 *   - "vencida" / "agotado" / "bajo" / "error"  -> warning (amarillo)
 *   - resto                                     -> info    (azul)
 * Nota: "error" cae en warning por simplicidad de color; el titulo lo aclara.
 */
function deriveVariant(title: string): NotificationVariant {
  const t = title.toLowerCase();
  if (
    t.includes('pagada') ||
    t.includes('bienvenido') ||
    t.includes('correctamente') ||
    t.includes('exitosa')
  ) {
    return 'success';
  }
  if (
    t.includes('vencida') ||
    t.includes('agotado') ||
    t.includes('bajo') ||
    t.includes('error') ||
    t.includes('insuficiente')
  ) {
    return 'warning';
  }
  return 'info';
}

function toFrontendNotification(n: BackendNotification): AppNotification {
  return {
    id: n.id,
    title: n.title,
    description: n.description ?? undefined,
    variant: deriveVariant(n.title),
    category: n.category as NotificationCategory,
    actionUrl: n.actionUrl ?? undefined,
    timestamp: Date.parse(n.createdAt),
    read: n.read,
  };
}

// ─── Requests ───────────────────────────────────────────────

export async function listNotificationsRequest(
  query: ListNotificationsQuery = {},
): Promise<{ items: AppNotification[]; total: number }> {
  const params = new URLSearchParams();
  params.set('page', String(query.page ?? 1));
  params.set('pageSize', String(query.pageSize ?? 100));
  if (query.read !== undefined) params.set('read', String(query.read));
  if (query.category) params.set('category', query.category);

  const res = await axiosClient.get<
    ApiResponse<PaginatedResponse<BackendNotification>>
  >(`/api/notifications?${params.toString()}`);

  return {
    items: res.data.data.items.map(toFrontendNotification),
    total: res.data.data.total,
  };
}

export async function markNotificationReadRequest(
  id: string,
): Promise<AppNotification> {
  const res = await axiosClient.patch<ApiResponse<BackendNotification>>(
    `/api/notifications/${id}/read`,
  );
  return toFrontendNotification(res.data.data);
}

export async function markAllNotificationsReadRequest(): Promise<number> {
  const res = await axiosClient.patch<ApiResponse<{ updated: number }>>(
    '/api/notifications/read-all',
  );
  return res.data.data.updated;
}

export async function deleteNotificationRequest(id: string): Promise<void> {
  await axiosClient.delete(`/api/notifications/${id}`);
}

export async function clearAllNotificationsRequest(): Promise<number> {
  const res = await axiosClient.delete<ApiResponse<{ removed: number }>>(
    '/api/notifications',
  );
  return res.data.data.removed;
}