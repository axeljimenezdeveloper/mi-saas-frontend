// src/api/company.ts
// Capa API para /api/company. Adapter entre CompanyPublic (backend) y
// CompanyData + CompanyPreferences (frontend).
//
// Nota: los tipos de companyStore se importan con `import type` para evitar
// un ciclo runtime (companyStore.ts -> company.ts -> companyStore.ts).

import { axiosClient } from './axiosClient';
import type {
  CompanyData,
  CompanyPreferences,
  CompanyCurrency,
  CompanyIva,
  BusinessType,
} from '../stores/companyStore';

// ─── Tipos del backend (contrato HTTP) ──────────────────────

interface BackendCompany {
  id: string;
  name: string;
  rif: string;
  address: string;
  currency: 'VES' | 'USD';
  defaultIva: string;
  businessType: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: true;
  data: T;
  error: null;
}

// ─── Adapter ────────────────────────────────────────────────

export interface AdaptedCompany {
  company: CompanyData;
  preferences: CompanyPreferences;
}

function toFrontend(c: BackendCompany): AdaptedCompany {
  return {
    company: {
      name: c.name,
      rif: c.rif,
      address: c.address,
    },
    preferences: {
      currency: c.currency as CompanyCurrency,
      defaultIva: c.defaultIva as CompanyIva,
      businessType: c.businessType as BusinessType,
    },
  };
}

// ─── Requests ───────────────────────────────────────────────

export async function fetchCompanyRequest(): Promise<AdaptedCompany> {
  const res = await axiosClient.get<ApiResponse<BackendCompany>>('/api/company');
  return toFrontend(res.data.data);
}

export async function onboardingRequest(
  data: CompanyData & CompanyPreferences,
): Promise<AdaptedCompany> {
  const res = await axiosClient.post<ApiResponse<BackendCompany>>(
    '/api/company/onboarding',
    {
      name: data.name,
      rif: data.rif,
      address: data.address,
      currency: data.currency,
      defaultIva: data.defaultIva,
      businessType: data.businessType,
    },
  );
  return toFrontend(res.data.data);
}

export async function updateCompanyRequest(
  data: CompanyData & CompanyPreferences,
): Promise<AdaptedCompany> {
  // El backend PUT /company usa settingsSchema que espera companyName (no name)
  // y no incluye businessType. El resto se mapea directo.
  const res = await axiosClient.put<ApiResponse<BackendCompany>>(
    '/api/company',
    {
      companyName: data.name,
      rif: data.rif,
      address: data.address,
      currency: data.currency,
      defaultIva: data.defaultIva,
    },
  );
  return toFrontend(res.data.data);
}