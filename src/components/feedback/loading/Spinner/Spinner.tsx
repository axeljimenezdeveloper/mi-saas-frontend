import styles from './Spinner.module.css';

export interface SpinnerProps {
  /** Tamaño del spinner. */
  size?: 'sm' | 'md' | 'lg';
  /** Color del spinner. Por defecto hereda del contexto (`currentColor`). */
  color?: 'primary' | 'muted' | 'inverse';
  /** Texto accesible para lectores de pantalla. */
  label?: string;
  /** Clase adicional. */
  className?: string;
}

export function Spinner({
  size = 'md',
  color = 'primary',
  label = 'Cargando',
  className,
}: SpinnerProps) {
  const classes = [
    styles.spinner,
    styles[size],
    styles[color],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={classes}
      role="status"
      aria-label={label}
    />
  );
}
