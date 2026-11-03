import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Receipt,
  Settings,
  Moon,
  Sun,
} from 'lucide-react';
import { Button } from './components/common/actions/Button';
import { PageContainer } from './components/layout/PageContainer';
import { PageHeader } from './components/layout/PageHeader';
import { Sidebar, type SidebarItem } from './components/layout/Sidebar';
import ProductsList from './features/inventory/pages/ProductsList';
import styles from './App.module.css';

type Theme = 'light' | 'dark';

const NAV_ITEMS: SidebarItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={18} />, href: '/dashboard' },
  { label: 'Inventario', icon: <Package size={18} />, href: '/products' },
  { label: 'Facturacion', icon: <Receipt size={18} />, href: '/billing', badge: 3 },
  { label: 'Configuracion', icon: <Settings size={18} />, href: '/settings' },
];

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const current = document.documentElement.getAttribute('data-theme');
    return current === 'light' ? 'light' : 'dark';
  });

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <div className={styles.app}>
      <Sidebar
        items={NAV_ITEMS}
        activeHref="/products"
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((v) => !v)}
      />
      <main className={styles.main}>
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
      </main>
    </div>
  );
}

export default App;
