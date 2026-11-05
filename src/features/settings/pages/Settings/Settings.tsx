import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import styles from './Settings.module.css';

interface FormState {
  companyName: string;
  rif: string;
  address: string;
  currency: 'VES' | 'USD';
  defaultIva: '0' | '8' | '16';
}

interface FormErrors {
  companyName?: string;
  rif?: string;
}

interface Touched {
  companyName?: boolean;
  rif?: boolean;
}

const CURRENCY_OPTIONS = [
  { value: 'VES', label: 'Bolivares (Bs.)' },
  { value: 'USD', label: 'Dolares (USD)' },
];

const IVA_OPTIONS = [
  { value: '0', label: '0% (Exento)' },
  { value: '8', label: '8% (Reducido)' },
  { value: '16', label: '16% (General)' },
];

const INITIAL_FORM: FormState = {
  companyName: 'Mi Empresa C.A.',
  rif: 'J-12345678-9',
  address: 'Av. Principal, Caracas, Venezuela',
  currency: 'VES',
  defaultIva: '16',
};

const RIF_REGEX = /^[VEJPG]-\d{8,9}-\d$/i;

const validateCompanyName = (value: string): string | undefined => {
  if (!value.trim()) return 'El nombre de la empresa es obligatorio';
  if (value.trim().length < 3) return 'Debe tener al menos 3 caracteres';
  return undefined;
};

const validateRif = (value: string): string | undefined => {
  if (!value.trim()) return 'El RIF es obligatorio';
  if (!RIF_REGEX.test(value.trim()))
    return 'Formato invalido. Ej: J-12345678-9';
  return undefined;
};

export default function Settings() {
  const navigate = useNavigate();
  const toast = useToast();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange =
    (field: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const value = e.target.value;
      setForm((f) => ({ ...f, [field]: value }));
      if (touched[field as keyof Touched] || errors[field as keyof FormErrors]) {
        setErrors((prev) => ({
          ...prev,
          [field]:
            field === 'companyName'
              ? validateCompanyName(value)
              : field === 'rif'
              ? validateRif(value)
              : undefined,
        }));
      }
    };

  const handleBlur = (field: keyof Touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]:
        field === 'companyName'
          ? validateCompanyName(form.companyName)
          : validateRif(form.rif),
    }));
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    const nameError = validateCompanyName(form.companyName);
    const rifError = validateRif(form.rif);
    if (nameError) next.companyName = nameError;
    if (rifError) next.rif = rifError;
    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ companyName: true, rif: true });
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error('No se pudo guardar', 'Revisa los campos marcados');
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Configuracion guardada', 'Los cambios fueron aplicados');
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
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
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
                value={form.companyName}
                onChange={handleChange('companyName')}
                onBlur={() => handleBlur('companyName')}
                error={touched.companyName ? errors.companyName : undefined}
              />
            </FormField>

            <FormField label="RIF" htmlFor="company-rif">
              <Input
                id="company-rif"
                placeholder="J-12345678-9"
                leftIcon={<Shield size={16} />}
                value={form.rif}
                onChange={handleChange('rif')}
                onBlur={() => handleBlur('rif')}
                error={touched.rif ? errors.rif : undefined}
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
                value={form.address}
                onChange={handleChange('address')}
              />
            </FormField>
          </FormGroup>

          <FormGroup
            title="Preferencias"
            description="Configuracion regional y de facturacion"
            layout="two-columns"
          >
            <FormField label="Moneda por defecto" htmlFor="pref-currency">
              <Select
                id="pref-currency"
                options={CURRENCY_OPTIONS}
                value={form.currency}
                onChange={handleChange('currency')}
              />
            </FormField>

            <FormField label="IVA por defecto" htmlFor="pref-iva">
              <Select
                id="pref-iva"
                options={IVA_OPTIONS}
                value={form.defaultIva}
                onChange={handleChange('defaultIva')}
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
