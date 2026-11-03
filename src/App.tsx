import { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Receipt,
  Settings,
  Moon,
  Sun,
  Bell,
} from 'lucide-react';
import { Button } from './components/common/actions/Button';
import { Avatar } from './components/common/data-display/Avatar';
import { PageContainer } from './components/layout/PageContainer';
import { PageHeader } from './components/layout/PageHeader';
import { Sidebar, type SidebarItem } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
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
      <div className={styles.content}>
        <Header
          brand={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Package size={20} />
              InvenSaaS
            </span>
          }
          actions={
            <>
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                aria-label="Notificaciones"
              >
                <Bell size={18} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconOnly
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
              <Avatar name="Axel Jimenez" size="sm" status="online" />
            </>
          }
        />
        <main className={styles.main}>
          <PageContainer maxWidth="lg" padding="md">
            <PageHeader
              title="Productos"
              subtitle="Gestiona el inventario de tu negocio"
            />
            <ProductsList />
          </PageContainer>
        </main>
      </div>
    </div>
  );
}

export default App;
