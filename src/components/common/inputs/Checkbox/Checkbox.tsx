import { forwardRef, useId } from 'react';
import { Check } from 'lucide-react';
import styles from './Checkbox.module.css';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Etiqueta del checkbox. */
  label: string;
  /** Texto de ayuda debajo del label. */
  helperText?: string;
  /** Mensaje de error. Si se pasa, el checkbox se marca como inválido. */
  error?: string;
  /** Tamaño del checkbox. */
  size?: 'sm' | 'md' | 'lg';
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      helperText,
      error,
      size = 'md',
      disabled,
      id,
      className,
      ...rest
    },
    ref
  ) => {
    const autoId = useId();
    const checkboxId = id ?? autoId;

    const wrapperClasses = [
      styles.checkbox,
      styles[size],
      error && styles.error,
      disabled && styles.disabled,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={styles.container}>
        <div className={wrapperClasses}>
          <label className={styles.boxWrapper} htmlFor={checkboxId}>
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              className={styles.nativeInput}
              disabled={disabled}
              aria-invalid={!!error}
              aria-label={label}
              {...rest}
            />
            <span className={styles.box} aria-hidden="true">
              <Check
                size={size === 'sm' ? 10 : size === 'lg' ? 16 : 13}
                strokeWidth={3}
              />
            </span>
          </label>
          <div className={styles.content}>
            <span className={styles.label}>{label}</span>
            {helperText && !error && (
              <span className={styles.helper}>{helperText}</span>
            )}
          </div>
        </div>
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
