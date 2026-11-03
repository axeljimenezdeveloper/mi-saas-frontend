import { Menu } from 'lucide-react';
import styles from './Header.module.css';

export interface HeaderProps {
  /** Contenido de la izquierda (logo o titulo de la marca). */
  brand?: React.ReactNode;
  /** Contenido central (ej. buscador). */
  search?: React.ReactNode;
  /** Contenido de la derecha (acciones: notificaciones, avatar, toggle). */
  actions?: React.ReactNode;
  /** Callback al hacer click en el boton hamburguesa (mobile). */
  onMenuClick?: () => void;
  /** Si es true, muestra el boton hamburguesa (tipicamente en mobile). */
  showMenuButton?: boolean;
  /** Clase adicional. */
  className?: string;
}

export function Header({
  brand,
  search,
  actions,
  onMenuClick,
  showMenuButton = false,
  className,
}: HeaderProps) {
  const classes = [styles.header, className].filter(Boolean).join(' ');

  return (
    <header className={classes}>
      <div className={styles.left}>
        {showMenuButton && (
          <button
            type="button"
            className={styles.menuButton}
            onClick={onMenuClick}
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
        )}
        {brand && <div className={styles.brand}>{brand}</div>}
      </div>

      {search && <div className={styles.search}>{search}</div>}

      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
