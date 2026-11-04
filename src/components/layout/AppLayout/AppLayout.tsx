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
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../common/actions/Button';
import { Avatar } from '../../common/data-display/Avatar';
import { Sidebar, type SidebarItem } from '../Sidebar';
import { Header } from '../Header';
import { MainLayout } from '../MainLayout';
import { useAuth } from '../../../context';

type Theme = 'light' | 'dark';

const NAV_ITEMS: SidebarItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={18} />, href: '/dashboard' },
  { label: 'Inventario', icon: <Package size={18} />, href: '/products' },
  { label: 'Facturacion', icon: <Receipt size={18} />, href: '/billing', badge: 3 },
  { label: 'Configuracion', icon: <Settings size={18} />, href: '/settings' },
];

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

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
    <MainLayout
      sidebar={
        <Sidebar
          items={NAV_ITEMS}
          activeHref={location.pathname}
          onNavigate={(href) => navigate(href)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((v) => !v)}
        />
      }
      renderHeader={(onMenuClick, isMobile) => (
        <Header
          showMenuButton={isMobile}
          onMenuClick={onMenuClick}
          brand={
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
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
                aria-label={
                  theme === 'dark'
                    ? 'Activar modo claro'
                    : 'Activar modo oscuro'
                }
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
              <Avatar
                name={user?.name ?? 'Invitado'}
                size="sm"
                status="online"
              />
            </>
          }
        />
      )}
    >
      <Outlet />
    </MainLayout>
  );
}
