import { forwardRef, useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import styles from './CurrencyInput.module.css';

export type Currency = 'VES' | 'USD';

export interface CurrencyInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'size' | 'value' | 'onChange' | 'type'
  > {
  /** Valor numerico del input. */
  value: number | undefined;
  /** Callback que recibe el valor numerico. */
  onChange: (value: number | undefined) => void;
  /** Moneda activa. */
  currency?: Currency;
  /** Callback al cambiar la moneda (solo si showCurrencySelector). */
  onCurrencyChange?: (currency: Currency) => void;
  /** Si es true, muestra un selector Bs./USD a la izquierda. */
  showCurrencySelector?: boolean;
  /** Mensaje de error. */
  error?: string;
  /** Si es true y no hay error, muestra borde verde + check. */
  success?: boolean;
  /** Texto de ayuda. */
  helperText?: string;
  /** Tamano del input. */
  size?: 'sm' | 'md' | 'lg';
  /** Si es true, ocupa el 100% del ancho. */
  fullWidth?: boolean;
}

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  VES: 'Bs.',
  USD: '$',
};

const CURRENCY_LOCALES: Record<Currency, string> = {
  VES: 'es-VE',
  USD: 'en-US',
};

function formatNumber(value: number, currency: Currency): string {
  return new Intl.NumberFormat(CURRENCY_LOCALES[currency], {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function parseNumber(formatted: string): number | undefined {
  const cleaned = formatted.replace(/[^\d.,-]/g, '');
  if (!cleaned) return undefined;

  const decimalMatch = cleaned.match(/[.,](\d{1,2})$/);
  let integerPart = cleaned;
  let decimalPart = '';

  if (decimalMatch) {
    const dec = decimalMatch[1];
    integerPart = cleaned.slice(0, cleaned.length - dec.length - 1);
    decimalPart = dec;
  }

  integerPart = integerPart.replace(/[.,]/g, '');
  const normalized = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
  const num = parseFloat(normalized);
  return Number.isNaN(num) ? undefined : num;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      value,
      onChange,
      currency = 'VES',
      onCurrencyChange,
      showCurrencySelector = false,
      error,
      success = false,
      helperText,
      size = 'md',
      fullWidth = false,
      disabled,
      placeholder = '0,00',
      className,
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = useState<string>('');
    const isFocusedRef = useRef(false);

    const showSuccess = success && !error && !disabled;

    useEffect(() => {
      if (isFocusedRef.current) return;
      if (value === undefined) {
        setDisplayValue('');
      } else {
        setDisplayValue(formatNumber(value, currency));
      }
    }, [value, currency]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setDisplayValue(raw);
      onChange(parseNumber(raw));
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      isFocusedRef.current = true;
      if (value !== undefined) {
        setDisplayValue(String(value));
      }
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      isFocusedRef.current = false;
      if (value !== undefined) {
        setDisplayValue(formatNumber(value, currency));
      } else {
        setDisplayValue('');
      }
      onBlur?.(e);
    };

    const wrapperClasses = [
      styles.wrapper,
      styles[size],
      error && styles.hasError,
      showSuccess && styles.success,
      disabled && styles.isDisabled,
      fullWidth && styles.fullWidth,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={styles.container}>
        <div className={wrapperClasses}>
          {showCurrencySelector ? (
            <select
              className={styles.currencySelect}
              value={currency}
              onChange={(e) => onCurrencyChange?.(e.target.value as Currency)}
              disabled={disabled}
              aria-label="Seleccionar moneda"
            >
              <option value="VES">Bs.</option>
              <option value="USD">USD</option>
            </select>
          ) : (
            <span className={styles.currencySymbol} aria-hidden="true">
              {CURRENCY_SYMBOLS[currency]}
            </span>
          )}
          <input
            ref={ref}
            type="text"
            inputMode="decimal"
            className={styles.input}
            value={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            aria-invalid={!!error}
            placeholder={placeholder}
            {...rest}
          />
          {showSuccess && (
            <span className={styles.iconSuccess} aria-hidden="true">
              <Check size={16} strokeWidth={3} />
            </span>
          )}
        </div>
        {error && <span className={styles.errorMessage}>{error}</span>}
        {!error && helperText && <span className={styles.helper}>{helperText}</span>}
      </div>
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';
