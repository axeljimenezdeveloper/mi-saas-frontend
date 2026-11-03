import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './components/common/actions/Button';
import { PageContainer } from './components/layout/PageContainer';
import { PageHeader } from './components/layout/PageHeader';
import ProductsList from './features/inventory/pages/ProductsList';

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
      <PageHeader
        title="Productos"
        subtitle="Gestiona el inventario de tu negocio"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            leftIcon={theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          >
            {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          </Button>
        }
      />
      <ProductsList />
    </PageContainer>
  );
}

export default App;
