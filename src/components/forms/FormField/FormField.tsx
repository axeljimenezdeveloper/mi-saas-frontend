import { useId } from 'react';
import styles from './FormField.module.css';

export interface FormFieldProps {
  /** Texto del label. */
  label: string;
  /** Contenido del campo (Input, Textarea, Select, etc.). */
  children: React.ReactNode;
  /** id del control interno. Si no se pasa, se genera uno con useId. */
  htmlFor?: string;
  /** Mensaje de error. Si existe, se muestra en rojo y oculta el helper. */
  error?: string;
  /** Texto de ayuda debajo del control (se oculta si hay error). */
  helperText?: string;
  /** Muestra un asterisco sutil al lado del label (no rojo). */
  required?: boolean;
  /** Texto "(opcional)" junto al label, para marcar campos no obligatorios. */
  optional?: boolean;
  /** Clase adicional. */
  className?: string;
}

export function FormField({
  label,
  children,
  htmlFor,
  error,
  helperText,
  required = false,
  optional = false,
  className,
}: FormFieldProps) {
  const autoId = useId();
  const fieldId = htmlFor ?? autoId;

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <label htmlFor={fieldId} className={styles.label}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">*</span>
        )}
        {optional && (
          <span className={styles.optional}>(opcional)</span>
        )}
      </label>
      {children}
      {error ? (
        <span className={styles.errorMessage} role="alert">{error}</span>
      ) : helperText ? (
        <span className={styles.helper}>{helperText}</span>
      ) : null}
    </div>
  );
}
