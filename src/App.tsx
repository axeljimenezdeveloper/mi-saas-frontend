import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, Download, X, Moon, Sun } from 'lucide-react';
import { Button } from './components/common/actions/Button';
import styles from './App.module.css';

type Theme = 'light' | 'dark';

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const current = document.documentElement.getAttribute('data-theme');
    return current === 'light' ? 'light' : 'dark';
  });

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
            <h1 className={styles.title}>Button — Showcase</h1>
            <p className={styles.subtitle}>
              Sistema de diseño · dark por defecto · tokens centralizados
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

        <Section title="Variants">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="link">Link</Button>
        </Section>

        <Section title="Sizes">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Section>

        <Section title="With Icons">
          <Button leftIcon={<Plus size={14} />}>Nuevo producto</Button>
          <Button variant="secondary" leftIcon={<Save size={14} />}>Guardar</Button>
          <Button variant="danger" leftIcon={<Trash2 size={14} />}>Eliminar</Button>
          <Button variant="outline" rightIcon={<Download size={14} />}>Descargar</Button>
        </Section>

        <Section title="Icon Only">
          <Button iconOnly aria-label="Nuevo"><Plus size={14} /></Button>
          <Button iconOnly variant="secondary" aria-label="Guardar"><Save size={14} /></Button>
          <Button iconOnly variant="danger" aria-label="Eliminar"><Trash2 size={14} /></Button>
          <Button iconOnly variant="ghost" aria-label="Cerrar"><X size={14} /></Button>
        </Section>

        <Section title="States">
          <Button isLoading>Guardando...</Button>
          <Button disabled>Deshabilitado</Button>
          <Button variant="danger" disabled>Deshabilitado</Button>
        </Section>

        <Section title="Full Width">
          <div className={styles.column}>
            <Button fullWidth>Botón de ancho completo</Button>
            <Button fullWidth variant="outline">Outline full width</Button>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.row}>{children}</div>
    </section>
  );
}

export default App;