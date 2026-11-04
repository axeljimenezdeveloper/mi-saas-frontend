import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Mail, Lock, Eye, EyeOff, Sun, Moon, LogIn } from 'lucide-react';
import { useAuth } from '../../../../context';
import { useToast } from '../../../../components/feedback/alerts/Toast';
import { FormField } from '../../../../components/forms/FormField';
import { Input } from '../../../../components/common/inputs/Input';
import { Button } from '../../../../components/common/actions/Button';
import { Alert } from '../../../../components/feedback/alerts/Alert';
import styles from './Login.module.css';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const current = document.documentElement.getAttribute('data-theme');
    return current === 'light' ? 'light' : 'dark';
  });

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!email.trim()) {
      next.email = 'El correo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'Ingresa un correo válido';
    }
    if (!password.trim()) {
      next.password = 'La contraseña es obligatoria';
    } else if (password.length < 6) {
      next.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});

    const success = await login(email, password);
    if (success) {
      toast.success('Bienvenido', 'Sesión iniciada correctamente');
      navigate('/dashboard');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
  };

  const fillDemoCredentials = () => {
    setEmail('admin@invensaas.com');
    setPassword('admin123');
    setErrors({});
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

      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Package size={28} />
          </div>
          <h1 className={styles.title}>InvenSaaS</h1>
          <p className={styles.subtitle}>
            Gestiona el inventario y la facturación de tu negocio
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <h2 className={styles.formTitle}>Iniciar sesión</h2>

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
              value={email}
              onChange={handleEmailChange}
              error={errors.email}
              autoComplete="email"
              autoFocus
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
              value={password}
              onChange={handlePasswordChange}
              error={errors.password}
              autoComplete="current-password"
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
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </form>

        <div className={styles.demoHint}>
          <p className={styles.demoLabel}>Credenciales de prueba</p>
          <button
            type="button"
            className={styles.demoButton}
            onClick={fillDemoCredentials}
          >
            <span>admin@invensaas.com</span>
            <span className={styles.demoSeparator}>·</span>
            <span>admin123</span>
          </button>
          <p className={styles.demoNote}>Click para rellenar automáticamente</p>
        </div>
      </div>
    </div>
  );
}
