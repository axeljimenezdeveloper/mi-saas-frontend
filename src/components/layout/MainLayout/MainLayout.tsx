import { useState } from 'react';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import styles from './MainLayout.module.css';

export interface MainLayoutProps {
  /** Slot del sidebar (usualmente <Sidebar />). */
  sidebar: React.ReactNode;
  /** Render prop del header. Recibe onMenuClick y isMobile. */
  renderHeader: (
    onMenuClick: () => void,
    isMobile: boolean
  ) => React.ReactNode;
  /** Contenido principal de la pagina. */
  children: React.ReactNode;
  /** Clase adicional. */
  className?: string;
}

export function MainLayout({
  sidebar,
  renderHeader,
  children,
  className,
}: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  // En mobile, al hacer click en cualquier link del sidebar, lo cerramos
  const handleSidebarClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('a')) {
      closeSidebar();
    }
  };

  const classes = [styles.layout, className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {renderHeader(openSidebar, isMobile)}
      <div className={styles.body}>
        {isSidebarOpen && (
          <div
            className={styles.backdrop}
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}
        <div
          className={[
            styles.sidebarWrapper,
            isSidebarOpen && styles.sidebarOpen,
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={handleSidebarClick}
        >
          {sidebar}
        </div>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}

