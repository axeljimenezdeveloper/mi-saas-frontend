import { Loader2 } from 'lucide-react';
import styles from './Button.module.css';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** Estilo visual del botón. */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
  /** Tamaño del botón. */
  size?: 'sm' | 'md' | 'lg';
  /** Si es true, el botón solo muestra un ícono (cuadrado). */
  iconOnly?: boolean;
  /** Si es true, muestra un spinner y deshabilita el botón. */
  isLoading?: boolean;
  /** Si es true, ocupa el 100% del ancho del contenedor. */
  fullWidth?: boolean;
  /** Ícono a la izquierda del texto. */
  leftIcon?: React.ReactNode;
  /** Ícono a la derecha del texto. */
  rightIcon?: React.ReactNode;
  /** Tipo de botón HTML. Por defecto 'button' para evitar submits accidentales. */
  type?: 'button' | 'submit' | 'reset';
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  iconOnly = false,
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  type = 'button',
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) => {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    iconOnly && styles.iconOnly,
    fullWidth && styles.fullWidth,
    isLoading && styles.isLoading,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const spinnerSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading && <Loader2 size={spinnerSize} className={styles.spinner} />}
      {!isLoading && leftIcon && <span className={styles.icon}>{leftIcon}</span>}
      {children && <span className={styles.label}>{children}</span>}
      {!isLoading && rightIcon && <span className={styles.icon}>{rightIcon}</span>}
    </button>
  );
};