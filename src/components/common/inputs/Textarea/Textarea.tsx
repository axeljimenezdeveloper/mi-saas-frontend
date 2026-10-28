import { forwardRef } from 'react';
import styles from './Textarea.module.css';

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  /** Estilo visual del textarea. */
  variant?: 'default' | 'filled' | 'outline';
  /** Tamaño del textarea (controla el min-height). */
  size?: 'sm' | 'md' | 'lg';
  /** Mensaje de error. Si se pasa, el textarea se marca como inválido. */
  error?: string;
  /** Texto de ayuda debajo del textarea. */
  helperText?: string;
  /** Si es true, ocupa el 100% del ancho. */
  fullWidth?: boolean;
  /** Controla si el usuario puede redimensionar. Por defecto 'vertical'. */
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      variant = 'default',
      size = 'md',
      error,
      helperText,
      fullWidth = false,
      resize = 'vertical',
      className,
      disabled,
      rows = 4,
      ...rest
    },
    ref
  ) => {
    const classes = [
      styles.textarea,
      styles[variant],
      styles[size],
      styles[`resize-${resize}`],
      error && styles.error,
      disabled && styles.disabled,
      fullWidth && styles.fullWidth,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={styles.container}>
        <textarea
          ref={ref}
          className={classes}
          disabled={disabled}
          aria-invalid={!!error}
          rows={rows}
          {...rest}
        />
        {error && <span className={styles.errorMessage}>{error}</span>}
        {!error && helperText && <span className={styles.helper}>{helperText}</span>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
