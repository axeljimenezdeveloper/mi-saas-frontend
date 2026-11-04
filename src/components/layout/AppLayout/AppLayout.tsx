import { useState } from 'react';
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
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../common/actions/Button';
import { Avatar } from '../../common/data-display/Avatar';
import { Sidebar, type SidebarItem } from '../Sidebar';
import { Header } from '../Header';
import { MainLayout } from '../MainLayout';
import { useAuth } from '../../../context';
import { useToast } from '../../feedback/alerts/Toast';
import { useThemeStore } from '../../../stores';
import styles from './AppLayout.module.css';

const NAV_ITEMS: SidebarItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={18} />, href: '/dashboard' },
  { label: 'Inventario', icon: <Package size={18} />, href: '/products' },
  { label: 'Facturacion', icon: <Receipt size={18} />, href: '/billing', badge: 3 },
  { label: 'Configuracion', icon: <Settings size={18} />, href: '/settings' },
];

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const toast = useToast();

  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsUserMenuOpen(false);
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
              <div className={styles.userMenuWrapper}>
                <button
                  type="button"
                  className={styles.userButton}
                  onClick={() => setIsUserMenuOpen((v) => !v)}
                  aria-label="Abrir menu de usuario"
                  aria-haspopup="menu"
                  aria-expanded={isUserMenuOpen}
                >
                  <Avatar
                    name={user?.name ?? 'Invitado'}
                    size="sm"
                    status="online"
                  />
                </button>
                {isUserMenuOpen && (
                  <>
                    <div
                      className={styles.userMenuBackdrop}
                      onClick={() => setIsUserMenuOpen(false)}
                      aria-hidden="true"
                    />
                    <div className={styles.userMenu} role="menu">
                      <div className={styles.userInfo}>
                        <p className={styles.userName}>{user?.name}</p>
                        <p className={styles.userEmail}>{user?.email}</p>
                      </div>
                      <button
                        type="button"
                        className={styles.logoutButton}
                        onClick={handleLogout}
                        role="menuitem"
                      >
                        <LogOut size={16} />
                        Cerrar sesion
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          }
        />
      )}
    >
      <Outlet />
    </MainLayout>
  );
}
