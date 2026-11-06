import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Package, Mail, Lock, Eye, EyeOff, Sun, Moon, LogIn } from 'lucide-react';
import { useToast } from '../../../../components/feedback/alerts/Toast';
import { FormField } from '../../../../components/forms/FormField';
import { Input } from '../../../../components/common/inputs/Input';
import { Button } from '../../../../components/common/actions/Button';
import { Alert } from '../../../../components/feedback/alerts/Alert';
import { useThemeStore, useAuthStore, useCompanyStore } from '../../../../stores';
import { loginSchema, type LoginFormData } from '../../../../schemas';
import { seedDemoData } from '../../../demo/demoData';
import styles from './Login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();

  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [showPassword, setShowPassword] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    const success = await login(data.email, data.password);
    if (success) {
      toast.success('Bienvenido', 'Sesion iniciada correctamente', { category: 'auth' });
      const isConfigured = useCompanyStore.getState().isConfigured;
      navigate(isConfigured ? '/dashboard' : '/onboarding');
    }
  };

  const handleDemoLogin = async () => {
    clearError();
    setIsDemoLoading(true);
    try {
      seedDemoData();
      const success = await login('admin@invensaas.com', 'admin123');
      if (success) {
        toast.success(
          'Modo demo activado',
          'Se cargaron productos, facturas y empresa de ejemplo',
          { category: 'system' }
        );
        navigate('/dashboard');
      }
    } finally {
      setIsDemoLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setValue('email', 'admin@invensaas.com', { shouldValidate: false });
    setValue('password', 'admin123', { shouldValidate: false });
    clearError();
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
          <div className={styles.logo}>
            <Package size={28} />
          </div>
          <h1 className={styles.title}>InvenSaaS</h1>
          <p className={styles.subtitle}>
            Gestiona el inventario y la facturacion de tu negocio
          </p>
          <button
            type="button"
            className={styles.demoLink}
            onClick={fillDemoCredentials}
          >
            Rellenar credenciales de prueba
          </button>
        </header>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          {error && (
            <Alert variant="error" onClose={clearError}>
              {error}
            </Alert>
          )}

          <FormField label="Correo electronico" htmlFor="login-email">
            <Input
              id="login-email"
              type="email"
              placeholder="tu@empresa.com"
              leftIcon={<Mail size={16} />}
              error={errors.email?.message}
              autoComplete="email"
              autoFocus
              {...register('email')}
            />
          </FormField>

          <FormField label="Contrasena" htmlFor="login-password">
            <Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Tu contrasena"
              leftIcon={<Lock size={16} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className={styles.eyeButton}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              error={errors.password?.message}
              autoComplete="current-password"
              {...register('password')}
            />
          </FormField>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            isLoading={isLoading}
            leftIcon={<LogIn size={16} />}
          >
            {isLoading ? 'Iniciando sesion...' : 'Iniciar sesion'}
          </Button>
        </form>

        <div className={styles.footerLinks}>
          <button
            type="button"
            className={styles.demoLink}
            onClick={handleDemoLogin}
            disabled={isDemoLoading || isLoading}
          >
            {isDemoLoading ? 'Cargando demo...' : 'Probar con datos de ejemplo'}
          </button>
        </div>

        <footer className={styles.creator}>
          <p className={styles.creatorName}>
            Desarrollado por <strong>Axel Gabriel Jimenez Malaver</strong>
          </p>
          <p className={styles.creatorMeta}>
            C.I. 27.870.662 · Ingenieria de Sistemas · UNA
          </p>
          <p className={styles.creatorMeta}>
            Evaluacion de Proyectos (225) · Lapso 2026-2
          </p>
        </footer>
      </div>
    </div>
  );
}

