import { forwardRef, useId } from 'react';
import styles from './Switch.module.css';

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Etiqueta del switch. */
  label: string;
  /** Texto de ayuda debajo del label. */
  helperText?: string;
  /** Mensaje de error. Si se pasa, el switch se marca como inválido. */
  error?: string;
  /** Tamaño del switch. */
  size?: 'sm' | 'md' | 'lg';
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
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
    const switchId = id ?? autoId;

    const wrapperClasses = [
      styles.switch,
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
          <label className={styles.trackWrapper} htmlFor={switchId}>
            <input
              ref={ref}
              id={switchId}
              type="checkbox"
              role="switch"
              className={styles.nativeInput}
              disabled={disabled}
              aria-invalid={!!error}
              aria-label={label}
              {...rest}
            />
            <span className={styles.track} aria-hidden="true">
              <span className={styles.thumb} />
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

Switch.displayName = 'Switch';
