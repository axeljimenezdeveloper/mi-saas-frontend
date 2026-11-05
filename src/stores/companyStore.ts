import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  setCompany: (data: CompanyData) => void;
  setPreferences: (data: CompanyPreferences) => void;
  completeOnboarding: () => void;
  reset: () => void;
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

export const useCompanyStore = create<CompanyStore>()(
  persist(
    (set) => ({
      company: EMPTY_COMPANY,
      preferences: DEFAULT_PREFERENCES,
      isConfigured: false,

      setCompany: (data) => set({ company: data }),

      setPreferences: (data) => set({ preferences: data }),

      completeOnboarding: () => set({ isConfigured: true }),

      reset: () =>
        set({
          company: EMPTY_COMPANY,
          preferences: DEFAULT_PREFERENCES,
          isConfigured: false,
        }),
    }),
    {
      name: STORAGE_KEY,
      // Solo persistimos los datos de la empresa y las preferencias.
      // isConfigured NO se persiste: en produccion lo validara el backend.
      // Al recargar, isConfigured vuelve a false y el usuario pasa por /onboarding
      // (pero con los campos precargados).
      partialize: (state) => ({
        company: state.company,
        preferences: state.preferences,
      }),
    }
  )
);
