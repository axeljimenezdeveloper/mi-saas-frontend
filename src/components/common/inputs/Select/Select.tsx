import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Estilo visual del select. */
  variant?: 'default' | 'filled' | 'outline';
  /** Tamaño del select. */
  size?: 'sm' | 'md' | 'lg';
  /** Mensaje de error. Si se pasa, el select se marca como inválido. */
  error?: string;
  /** Texto de ayuda debajo del select. */
  helperText?: string;
  /** Ícono a la izquierda del texto. */
  leftIcon?: React.ReactNode;
  /** Si es true, ocupa el 100% del ancho. */
  fullWidth?: boolean;
  /** Opciones del dropdown. */
  options: SelectOption[];
  /** Texto mostrado cuando no hay valor seleccionado. */
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      variant = 'default',
      size = 'md',
      error,
      helperText,
      leftIcon,
      fullWidth = false,
      options,
      placeholder,
      className,
      disabled,
      value,
      ...rest
    },
    ref
  ) => {
    const wrapperClasses = [
      styles.selectWrapper,
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
          <select
            ref={ref}
            className={styles.select}
            disabled={disabled}
            aria-invalid={!!error}
            value={value}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className={styles.chevron} aria-hidden="true" />
        </div>
        {error && <span className={styles.errorMessage}>{error}</span>}
        {!error && helperText && <span className={styles.helper}>{helperText}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
