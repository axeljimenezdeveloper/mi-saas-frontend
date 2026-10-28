import { useEffect, useState } from 'react';
import {
  Plus,
  Trash2,
  Save,
  Download,
  X,
  Moon,
  Sun,
  Search,
  Mail,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from './components/common/actions/Button';
import { Input } from './components/common/inputs/Input';
import styles from './App.module.css';

type Theme = 'light' | 'dark';

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const current = document.documentElement.getAttribute('data-theme');
    return current === 'light' ? 'light' : 'dark';
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Design System — Showcase</h1>
            <p className={styles.subtitle}>
              Button · Input · dark por defecto · tokens centralizados
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            leftIcon={theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          >
            {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          </Button>
        </header>

        {/* ================= BUTTON ================= */}
        <Section title="Button — Variants">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="link">Link</Button>
        </Section>

        <Section title="Button — Sizes & Icons">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button leftIcon={<Plus size={14} />}>Nuevo producto</Button>
          <Button variant="secondary" leftIcon={<Save size={14} />}>
            Guardar
          </Button>
          <Button variant="danger" leftIcon={<Trash2 size={14} />}>
            Eliminar
          </Button>
          <Button variant="outline" rightIcon={<Download size={14} />}>
            Descargar
          </Button>
        </Section>

        <Section title="Button — Icon Only & States">
          <Button iconOnly aria-label="Nuevo">
            <Plus size={14} />
          </Button>
          <Button iconOnly variant="secondary" aria-label="Guardar">
            <Save size={14} />
          </Button>
          <Button iconOnly variant="danger" aria-label="Eliminar">
            <Trash2 size={14} />
          </Button>
          <Button iconOnly variant="ghost" aria-label="Cerrar">
            <X size={14} />
          </Button>
          <Button isLoading>Guardando...</Button>
          <Button disabled>Deshabilitado</Button>
        </Section>

        {/* ================= INPUT ================= */}
        <Section title="Input — Variants">
          <div className={styles.formColumn}>
            <Input placeholder="Default variant" />
            <Input variant="filled" placeholder="Filled variant" />
            <Input variant="outline" placeholder="Outline variant" />
          </div>
        </Section>

        <Section title="Input — Sizes">
          <div className={styles.formColumn}>
            <Input size="sm" placeholder="Small input" />
            <Input size="md" placeholder="Medium input" />
            <Input size="lg" placeholder="Large input" />
          </div>
        </Section>

        <Section title="Input — With Icons">
          <div className={styles.formColumn}>
            <Input
              leftIcon={<Search size={16} />}
              placeholder="Buscar producto..."
            />
            <Input
              leftIcon={<Mail size={16} />}
              placeholder="correo@empresa.com"
              type="email"
            />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              leftIcon={<Eye size={16} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    display: 'flex',
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
          </div>
        </Section>

        <Section title="Input — States">
          <div className={styles.formColumn}>
            <Input
              placeholder="Con helper text"
              helperText="Este es un texto de ayuda"
            />
            <Input
              placeholder="Con error"
              error="Este campo es obligatorio"
            />
            <Input placeholder="Deshabilitado" disabled />
            <Input placeholder="Read only" readOnly value="Solo lectura" />
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.row}>{children}</div>
    </section>
  );
}

export default App;
