import { forwardRef, useId } from 'react';
import styles from './Radio.module.css';

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Etiqueta del radio. */
  label: string;
  /** Texto de ayuda debajo del label. */
  helperText?: string;
  /** Mensaje de error. Si se pasa, el radio se marca como inválido. */
  error?: string;
  /** Tamaño del radio. */
  size?: 'sm' | 'md' | 'lg';
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
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
    const radioId = id ?? autoId;

    const wrapperClasses = [
      styles.radio,
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
          <label className={styles.boxWrapper} htmlFor={radioId}>
            <input
              ref={ref}
              id={radioId}
              type="radio"
              className={styles.nativeInput}
              disabled={disabled}
              aria-invalid={!!error}
              aria-label={label}
              {...rest}
            />
            <span className={styles.box} aria-hidden="true">
              <span className={styles.dot} />
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

Radio.displayName = 'Radio';
