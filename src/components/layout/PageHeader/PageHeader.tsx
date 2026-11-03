import { ArrowLeft } from 'lucide-react';
import styles from './PageHeader.module.css';

export interface PageHeaderProps {
  /** Titulo principal de la pagina. */
  title: string;
  /** Subtitulo opcional debajo del titulo. */
  subtitle?: string;
  /** Slot para acciones (botones) alineadas a la derecha. */
  actions?: React.ReactNode;
  /** Si se pasa, muestra un boton "Volver" a la izquierda del titulo. */
  onBack?: () => void;
  /** Etiqueta del boton Volver. Por defecto "Volver". */
  backLabel?: string;
  /** Clase adicional. */
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  actions,
  onBack,
  backLabel = 'Volver',
  className,
}: PageHeaderProps) {
  const classes = [styles.header, className].filter(Boolean).join(' ');

  return (
    <header className={classes}>
      <div className={styles.main}>
        {onBack && (
          <button
            type="button"
            className={styles.backButton}
            onClick={onBack}
            aria-label={backLabel}
          >
            <ArrowLeft size={16} />
            <span>{backLabel}</span>
          </button>
        )}
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
