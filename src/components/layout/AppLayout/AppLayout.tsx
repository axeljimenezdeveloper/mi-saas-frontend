import {
  LayoutDashboard,
  Package,
  Receipt,
  Settings,
  Moon,
  Sun,
  Bell,
  LogOut,
} from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../common/actions/Button';
import { Avatar } from '../../common/data-display/Avatar';
import { Sidebar, type SidebarItem } from '../Sidebar';
import { Header } from '../Header';
import { MainLayout } from '../MainLayout';
import { useToast } from '../../feedback/alerts/Toast';
import { useThemeStore, useSidebarStore, useAuthStore } from '../../../stores';
import styles from './AppLayout.module.css';

const NAV_ITEMS: SidebarItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={18} />, href: '/dashboard' },
  { label: 'Inventario', icon: <Package size={18} />, href: '/products' },
  { label: 'Facturacion', icon: <Receipt size={18} />, href: '/billing' },
  { label: 'Configuracion', icon: <Settings size={18} />, href: '/settings' },
];

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  const isCollapsed = useSidebarStore((s) => s.isCollapsed);
  const toggleCollapse = useSidebarStore((s) => s.toggleCollapse);

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    toast.success('Sesion cerrada', 'Hasta pronto');
    navigate('/login');
  };

  return (
    <MainLayout
      sidebar={
        <Sidebar
          items={NAV_ITEMS}
          activeHref={location.pathname}
          onNavigate={(href) => navigate(href)}
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
          footer={
            <button
              type="button"
              className={[
                styles.logoutButton,
                isCollapsed && styles.logoutButtonCollapsed,
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={handleLogout}
              title={isCollapsed ? 'Cerrar sesion' : undefined}
              aria-label="Cerrar sesion"
            >
              <LogOut size={18} />
              {!isCollapsed && <span>Cerrar sesion</span>}
            </button>
          }
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
              <Link
                to="/settings"
                className={styles.userLink}
                aria-label="Configuracion de la cuenta"
                title="Configuracion de la cuenta"
              >
                <Avatar
                  name={user?.name ?? 'Invitado'}
                  size="sm"
                  status="online"
                />
              </Link>
            </>
          }
        />
      )}
    >
      <Outlet />
    </MainLayout>
  );
}
