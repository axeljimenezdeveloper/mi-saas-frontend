import { forwardRef } from 'react';
import styles from './Input.module.css';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Estilo visual del input. */
  variant?: 'default' | 'filled' | 'outline';
  /** Tamaño del input. */
  size?: 'sm' | 'md' | 'lg';
  /** Mensaje de error. Si se pasa, el input se marca como inválido. */
  error?: string;
  /** Texto de ayuda debajo del input. */
  helperText?: string;
  /** Ícono a la izquierda del texto. */
  leftIcon?: React.ReactNode;
  /** Ícono a la derecha del texto. */
  rightIcon?: React.ReactNode;
  /** Si es true, ocupa el 100% del ancho. */
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      size = 'md',
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      disabled,
      ...rest
    },
    ref
  ) => {
    const wrapperClasses = [
      styles.inputWrapper,
      styles[variant],
      styles[size],
      error && styles.error,
      disabled && styles.disabled,
      fullWidth && styles.fullWidth,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={styles.container}>
        <div className={wrapperClasses}>
          {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
          <input
            ref={ref}
            className={styles.input}
            disabled={disabled}
            aria-invalid={!!error}
            {...rest}
          />
          {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
        </div>
        {error && <span className={styles.errorMessage}>{error}</span>}
        {!error && helperText && <span className={styles.helper}>{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
