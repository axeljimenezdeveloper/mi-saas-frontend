// src/stores/companyStore.ts
// Feature flag: con USE_BACKEND=false mantiene el comportamiento actual.
// Con USE_BACKEND=true expone fetchCompany/submitOnboarding/saveCompany
// que hablan con GET/POST/PUT /api/company.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { USE_BACKEND } from '../config/backend';
import {
  fetchCompanyRequest,
  onboardingRequest,
  updateCompanyRequest,
} from '../api/company';

export type CompanyCurrency = 'VES' | 'USD';
export type CompanyIva = '0' | '8' | '16';
export type BusinessType = 'retail' | 'food' | 'services' | 'other';

export interface CompanyData {
  name: string;
  rif: string;
  address: string;
}

export interface CompanyPreferences {
  currency: CompanyCurrency;
  defaultIva: CompanyIva;
  businessType: BusinessType;
}

export interface CompanyStore {
  company: CompanyData;
  preferences: CompanyPreferences;
  isConfigured: boolean;
  isLoading: boolean;
  error: string | null;
  setCompany: (data: CompanyData) => void;
  setPreferences: (data: CompanyPreferences) => void;
  completeOnboarding: () => void;
  reset: () => void;
  // ─── Metodos backend-aware ────────────────────────────
  fetchCompany: () => Promise<boolean>;
  submitOnboarding: (data: CompanyData & CompanyPreferences) => Promise<boolean>;
  saveCompany: (data: CompanyData & CompanyPreferences) => Promise<boolean>;
  clearError: () => void;
}

const EMPTY_COMPANY: CompanyData = {
  name: '',
  rif: '',
  address: '',
};

const DEFAULT_PREFERENCES: CompanyPreferences = {
  currency: 'VES',
  defaultIva: '16',
  businessType: 'retail',
};

const STORAGE_KEY = 'mi-saas-company';

interface AxiosLikeError {
  response?: {
    status?: number;
    data?: { error?: { code?: string; message?: string } };
  };
}

function extractErrorCode(err: unknown): string | null {
  if (typeof err !== 'object' || err === null) return null;
  const resp = (err as AxiosLikeError).response;
  return resp?.data?.error?.code ?? null;
}

function extractErrorMessage(err: unknown, fallback: string): string {
  if (typeof err !== 'object' || err === null) return fallback;
  const resp = (err as AxiosLikeError).response;
  return resp?.data?.error?.message ?? fallback;
}

export const useCompanyStore = create<CompanyStore>()(
  persist(
    (set) => ({
      company: EMPTY_COMPANY,
      preferences: DEFAULT_PREFERENCES,
      isConfigured: false,
      isLoading: false,
      error: null,

      setCompany: (data) => set({ company: data }),

      setPreferences: (data) => set({ preferences: data }),

      completeOnboarding: () => set({ isConfigured: true }),

      reset: () =>
        set({
          company: EMPTY_COMPANY,
          preferences: DEFAULT_PREFERENCES,
          isConfigured: false,
          isLoading: false,
          error: null,
        }),

      // ─── fetchCompany: GET /api/company ─────────────────
      // 404 ONBOARDING_REQUIRED se trata como "no configurado" sin error.
      fetchCompany: async (): Promise<boolean> => {
        if (!USE_BACKEND) return false;
        set({ isLoading: true, error: null });
        try {
          const { company, preferences } = await fetchCompanyRequest();
          set({ company, preferences, isConfigured: true, isLoading: false });
          return true;
        } catch (err) {
          if (extractErrorCode(err) === 'ONBOARDING_REQUIRED') {
            set({ isLoading: false, isConfigured: false });
            return false;
          }
          set({
            error: extractErrorMessage(err, 'No se pudo cargar la empresa'),
            isLoading: false,
          });
          return false;
        }
      },

      // ─── submitOnboarding: POST /api/company/onboarding ─
      submitOnboarding: async (data): Promise<boolean> => {
        if (!USE_BACKEND) return false;
        set({ isLoading: true, error: null });
        try {
          const { company, preferences } = await onboardingRequest(data);
          set({
            company,
            preferences,
            isConfigured: true,
            isLoading: false,
          });
          return true;
        } catch (err) {
          set({
            error: extractErrorMessage(err, 'No se pudo completar el onboarding'),
            isLoading: false,
          });
          return false;
        }
      },

      // ─── saveCompany: PUT /api/company ──────────────────
      saveCompany: async (data): Promise<boolean> => {
        if (!USE_BACKEND) return false;
        set({ isLoading: true, error: null });
        try {
          const { company, preferences } = await updateCompanyRequest(data);
          set({ company, preferences, isLoading: false });
          return true;
        } catch (err) {
          set({
            error: extractErrorMessage(err, 'No se pudieron guardar los cambios'),
            isLoading: false,
          });
          return false;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: STORAGE_KEY,
      // Solo persistimos datos de dominio. isLoading y error son transitorios.
      partialize: (state) => ({
        company: state.company,
        preferences: state.preferences,
        isConfigured: state.isConfigured,
      }),
    }
  )
);