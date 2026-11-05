import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building2,
  Save,
  LogOut,
  Mail,
  Shield,
} from 'lucide-react';
import { FormField } from '../../../../components/forms/FormField';
import { FormGroup } from '../../../../components/forms/FormGroup';
import { Input } from '../../../../components/common/inputs/Input';
import { Select } from '../../../../components/common/inputs/Select';
import { Button } from '../../../../components/common/actions/Button';
import { Card } from '../../../../components/common/data-display/Card';
import { Avatar } from '../../../../components/common/data-display/Avatar';
import { Badge } from '../../../../components/common/data-display/Badge';
import { useToast } from '../../../../components/feedback/alerts/Toast';
import { useAuthStore } from '../../../../stores';
import { settingsSchema, type SettingsFormData } from '../../../../schemas';
import styles from './Settings.module.css';

const CURRENCY_OPTIONS = [
  { value: 'VES', label: 'Bolivares (Bs.)' },
  { value: 'USD', label: 'Dolares (USD)' },
];

const IVA_OPTIONS = [
  { value: '0', label: '0% (Exento)' },
  { value: '8', label: '8% (Reducido)' },
  { value: '16', label: '16% (General)' },
];

const DEFAULT_VALUES: SettingsFormData = {
  companyName: 'Mi Empresa C.A.',
  rif: 'J-12345678-9',
  address: 'Av. Principal, Caracas, Venezuela',
  currency: 'VES',
  defaultIva: '16',
};

export default function Settings() {
  const navigate = useNavigate();
  const toast = useToast();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onBlur',
  });

  const onSubmit = (data: SettingsFormData) => {
    // Simula guardado (sin backend aun). Los datos ya estan validados por Zod.
    setTimeout(() => {
      toast.success(
        'Configuracion guardada',
        `Datos de ${data.companyName} actualizados`
      );
    }, 1000);
  };

  const handleLogout = () => {
    logout();
    toast.success('Sesion cerrada', 'Hasta pronto');
    navigate('/login');
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>Configuracion</h1>
            <p className={styles.subtitle}>
              Administra la informacion de tu negocio
            </p>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <FormGroup
            title="Datos de la empresa"
            description="Informacion fiscal y de contacto"
            layout="two-columns"
          >
            <FormField label="Nombre de la empresa" htmlFor="company-name">
              <Input
                id="company-name"
                placeholder="Ej. Mi Empresa C.A."
                leftIcon={<Building2 size={16} />}
                error={errors.companyName?.message}
                {...register('companyName')}
              />
            </FormField>

            <FormField label="RIF" htmlFor="company-rif">
              <Input
                id="company-rif"
                placeholder="J-12345678-9"
                leftIcon={<Shield size={16} />}
                error={errors.rif?.message}
                {...register('rif')}
              />
            </FormField>

            <FormField
              label="Direccion fiscal"
              htmlFor="company-address"
              optional
            >
              <Input
                id="company-address"
                placeholder="Av. Principal, Caracas, Venezuela"
                {...register('address')}
              />
            </FormField>
          </FormGroup>

          <FormGroup
            title="Preferencias"
            description="Configuracion regional y de facturacion"
            layout="two-columns"
          >
            <FormField label="Moneda por defecto" htmlFor="pref-currency">
              <Controller
                control={control}
                name="currency"
                render={({ field }) => (
                  <Select
                    id="pref-currency"
                    options={CURRENCY_OPTIONS}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </FormField>

            <FormField label="IVA por defecto" htmlFor="pref-iva">
              <Controller
                control={control}
                name="defaultIva"
                render={({ field }) => (
                  <Select
                    id="pref-iva"
                    options={IVA_OPTIONS}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </FormField>
          </FormGroup>

          <FormGroup
            title="Cuenta"
            description="Informacion del usuario actual"
            layout="stack"
          >
            <Card padding="md">
              <div className={styles.accountCard}>
                <div className={styles.accountInfo}>
                  <Avatar
                    name={user?.name ?? 'Invitado'}
                    size="lg"
                    status="online"
                  />
                  <div className={styles.accountDetails}>
                    <div className={styles.accountNameRow}>
                      <p className={styles.accountName}>{user?.name}</p>
                      <Badge variant="primary" size="sm">
                        {user?.role === 'admin' ? 'Administrador' : 'Cajero'}
                      </Badge>
                    </div>
                    <p className={styles.accountEmail}>
                      <Mail size={14} />
                      {user?.email}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  leftIcon={<LogOut size={14} />}
                  onClick={handleLogout}
                >
                  Cerrar sesion
                </Button>
              </div>
            </Card>
          </FormGroup>

          <div className={styles.footer}>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<Save size={14} />}
              isLoading={isSubmitting}
            >
              Guardar cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
