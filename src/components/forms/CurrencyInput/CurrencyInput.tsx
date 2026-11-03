import { forwardRef, useEffect, useRef, useState } from 'react';
import styles from './CurrencyInput.module.css';

export type Currency = 'VES' | 'USD';

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'onChange' | 'type'> {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  currency?: Currency;
  onCurrencyChange?: (currency: Currency) => void;
  showCurrencySelector?: boolean;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
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

/**
 * Parsea un string de entrada a numero.
 * Reglas:
 * - Si termina en separador + 1-2 digitos, ese es el decimal (sirve para Bs. y USD).
 * - Si no, todos los separadores son de miles.
 */
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

    // Solo reformatea cuando el input NO esta enfocado
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
      // Muestra el valor crudo para editar facilmente
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
        </div>
        {error && <span className={styles.errorMessage}>{error}</span>}
        {!error && helperText && <span className={styles.helper}>{helperText}</span>}
      </div>
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';
