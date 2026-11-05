import { forwardRef } from 'react';
import { Check } from 'lucide-react';
import styles from './Input.module.css';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'filled' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  error?: string;
  success?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      size = 'md',
      error,
      success = false,
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
    const showSuccess = success && !error && !disabled;
    const wrapperClasses = [
      styles.inputWrapper,
      styles[variant],
      styles[size],
      error && styles.error,
      showSuccess && styles.success,
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
          {rightIcon ? (
            <span className={styles.icon}>{rightIcon}</span>
          ) : showSuccess ? (
            <span className={styles.iconSuccess} aria-hidden="true">
              <Check size={16} strokeWidth={3} />
            </span>
          ) : null}
        </div>
        {error && <span className={styles.errorMessage}>{error}</span>}
        {!error && helperText && <span className={styles.helper}>{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
