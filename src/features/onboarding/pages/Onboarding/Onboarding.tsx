import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building2,
  Shield,
  MapPin,
  DollarSign,
  Percent,
  Store,
  ArrowLeft,
  ArrowRight,
  Check,
  Moon,
  Sun,
} from 'lucide-react';
import { FormField } from '../../../../components/forms/FormField';
import { Input } from '../../../../components/common/inputs/Input';
import { Select } from '../../../../components/common/inputs/Select';
import { Radio } from '../../../../components/common/inputs/Radio';
import { Button } from '../../../../components/common/actions/Button';
import { useToast } from '../../../../components/feedback/alerts/Toast';
import { useThemeStore, useCompanyStore } from '../../../../stores';
import { onboardingSchema, type OnboardingFormData } from '../../../../schemas';
import { DEMO_COMPANY, DEMO_PREFERENCES } from '../../../demo/demoData';
import styles from './Onboarding.module.css';

const CURRENCY_OPTIONS = [
  { value: 'VES', label: 'Bolivares (Bs.)' },
  { value: 'USD', label: 'Dolares (USD)' },
];

const IVA_OPTIONS = [
  { value: '0', label: '0% (Exento)' },
  { value: '8', label: '8% (Reducido)' },
  { value: '16', label: '16% (General)' },
];

const BUSINESS_TYPE_OPTIONS: {
  value: OnboardingFormData['businessType'];
  label: string;
  helper: string;
}[] = [
  { value: 'retail', label: 'Retail', helper: 'Tienda o comercio' },
  { value: 'food', label: 'Alimentos', helper: 'Restaurante o abastos' },
  { value: 'services', label: 'Servicios', helper: 'Consultoria o similar' },
  { value: 'other', label: 'Otro', helper: 'Otro tipo de negocio' },
];

const DEFAULT_VALUES: OnboardingFormData = {
  name: '',
  rif: '',
  address: '',
  currency: 'VES',
  defaultIva: '16',
  businessType: 'retail',
};

const DEMO_VALUES: OnboardingFormData = {
  name: DEMO_COMPANY.name,
  rif: DEMO_COMPANY.rif,
  address: DEMO_COMPANY.address,
  currency: DEMO_PREFERENCES.currency,
  defaultIva: DEMO_PREFERENCES.defaultIva,
  businessType: DEMO_PREFERENCES.businessType,
};

export default function Onboarding() {
  const navigate = useNavigate();
  const toast = useToast();

  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  const setCompany = useCompanyStore((s) => s.setCompany);
  const setPreferences = useCompanyStore((s) => s.setPreferences);
  const completeOnboarding = useCompanyStore((s) => s.completeOnboarding);

  const [step, setStep] = useState<1 | 2>(1);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    reset,
    formState: { errors, isValid },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
  });

  const handleFillDemo = () => {
    reset(DEMO_VALUES);
    toast.info(
      'Datos de ejemplo cargados',
      'Puedes editarlos antes de finalizar',
      { category: 'system' }
    );
  };

  const handleNext = async () => {
    const ok = await trigger(['name', 'rif', 'address']);
    if (ok) setStep(2);
  };

  const handleBack = () => setStep(1);

  const onSubmit = (data: OnboardingFormData) => {
    setCompany({
      name: data.name.trim(),
      rif: data.rif.trim(),
      address: data.address.trim(),
    });
    setPreferences({
      currency: data.currency,
      defaultIva: data.defaultIva,
      businessType: data.businessType,
    });
    completeOnboarding();
    toast.success(
      '¡Bienvenido a InvenSaaS!',
      `${data.name.trim()} esta listo para comenzar`,
      { category: 'system' }
    );
    navigate('/dashboard');
  };

  return (
    <div className={styles.page}>
      <button
        type="button"
        className={styles.themeToggle}
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Configura tu empresa</h1>
          <p className={styles.subtitle}>
            Cuentanos sobre tu negocio para personalizar tu experiencia
          </p>
          <button
            type="button"
            className={styles.demoLink}
            onClick={handleFillDemo}
          >
            Usar datos de ejemplo
          </button>
        </header>

        {/* Barra de progreso */}
        <div className={styles.progress}>
          <div className={[styles.step, step >= 1 && styles.active].filter(Boolean).join(' ')}>
            <div className={styles.stepCircle}>
              {step > 1 ? <Check size={14} strokeWidth={3} /> : '1'}
            </div>
            <span className={styles.stepLabel}>Empresa</span>
          </div>
          <div className={[styles.stepLine, step >= 2 && styles.activeLine].filter(Boolean).join(' ')} />
          <div className={[styles.step, step >= 2 && styles.active].filter(Boolean).join(' ')}>
            <div className={styles.stepCircle}>2</div>
            <span className={styles.stepLabel}>Preferencias</span>
          </div>
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {step === 1 && (
            <div className={styles.fields}>
              <FormField label="Nombre de la empresa" htmlFor="onb-name">
                <Input
                  id="onb-name"
                  placeholder="Ej. Mi Empresa C.A."
                  leftIcon={<Building2 size={16} />}
                  error={errors.name?.message}
                  autoFocus
                  {...register('name')}
                />
              </FormField>

              <FormField label="RIF" htmlFor="onb-rif" helperText="Formato: J-12345678-9">
                <Input
                  id="onb-rif"
                  placeholder="J-12345678-9"
                  leftIcon={<Shield size={16} />}
                  error={errors.rif?.message}
                  {...register('rif')}
                />
              </FormField>

              <FormField label="Direccion fiscal" htmlFor="onb-address">
                <Input
                  id="onb-address"
                  placeholder="Av. Principal, Caracas, Venezuela"
                  leftIcon={<MapPin size={16} />}
                  error={errors.address?.message}
                  {...register('address')}
                />
              </FormField>

              <div className={styles.footer}>
                <Button
                  type="button"
                  variant="primary"
                  rightIcon={<ArrowRight size={14} />}
                  onClick={handleNext}
                >
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={styles.fields}>
              <FormField label="Moneda por defecto" htmlFor="onb-currency">
                <Controller
                  control={control}
                  name="currency"
                  render={({ field }) => (
                    <Select
                      id="onb-currency"
                      options={CURRENCY_OPTIONS}
                      leftIcon={<DollarSign size={16} />}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      error={errors.currency?.message}
                    />
                  )}
                />
              </FormField>

              <FormField label="IVA por defecto" htmlFor="onb-iva">
                <Controller
                  control={control}
                  name="defaultIva"
                  render={({ field }) => (
                    <Select
                      id="onb-iva"
                      options={IVA_OPTIONS}
                      leftIcon={<Percent size={16} />}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      error={errors.defaultIva?.message}
                    />
                  )}
                />
              </FormField>

              <div className={styles.field}>
                <label className={styles.label}>
                  <Store size={14} />
                  Tipo de negocio
                </label>
                <div className={styles.radioGrid}>
                  {BUSINESS_TYPE_OPTIONS.map((opt) => (
                    <Radio
                      key={opt.value}
                      id={`onb-type-${opt.value}`}
                      value={opt.value}
                      label={opt.label}
                      helperText={opt.helper}
                      fullWidth
                      {...register('businessType')}
                    />
                  ))}
                </div>
                {errors.businessType && (
                  <span className={styles.fieldError}>
                    {errors.businessType.message}
                  </span>
                )}
              </div>

              <div className={styles.footer}>
                <Button
                  type="button"
                  variant="outline"
                  leftIcon={<ArrowLeft size={14} />}
                  onClick={handleBack}
                >
                  Atras
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  leftIcon={<Check size={14} />}
                  disabled={!isValid}
                >
                  Finalizar configuracion
                </Button>
              </div>
            </div>
          )}
        </form>

        <p className={styles.hint}>
          Paso {step} de 2 · Podras cambiar estos datos despues en Configuracion
        </p>
      </div>
    </div>
  );
}


