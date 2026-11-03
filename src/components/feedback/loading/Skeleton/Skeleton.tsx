import styles from './Skeleton.module.css';

export interface SkeletonProps {
  /** Forma del skeleton. */
  variant?: 'text' | 'circular' | 'rectangular';
  /** Ancho (CSS). Si no se pasa, ocupa el 100%. */
  width?: string;
  /** Alto (CSS). Solo aplica a rectangular. */
  height?: string;
  /** Numero de lineas (solo para variant="text"). */
  lines?: number;
  /** Clase adicional. */
  className?: string;
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  lines = 1,
  className,
}: SkeletonProps) {
  const baseClass = [styles.skeleton, styles[variant], className]
    .filter(Boolean)
    .join(' ');

  if (variant === 'text' && lines > 1) {
    return (
      <div className={styles.textGroup} aria-hidden="true">
        {Array.from({ length: lines }).map((_, i) => {
          const isLast = i === lines - 1;
          return (
            <span
              key={i}
              className={baseClass}
              style={{
                width: isLast ? '60%' : width,
                height,
              }}
            />
          );
        })}
      </div>
    );
  }

  return (
    <span
      className={baseClass}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}
