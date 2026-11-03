import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './components/common/actions/Button';
import { PageContainer } from './components/layout/PageContainer';
import ProductsList from './features/inventory/pages/ProductsList';
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
    <PageContainer maxWidth="lg" padding="md">
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Productos</h1>
          <p className={styles.subtitle}>
            Gestiona el inventario de tu negocio
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

      <ProductsList />
    </PageContainer>
  );
}

export default App;
