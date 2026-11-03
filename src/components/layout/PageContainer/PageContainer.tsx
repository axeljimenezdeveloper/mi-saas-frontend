import styles from './PageContainer.module.css';

export interface PageContainerProps {
  /** Ancho maximo del contenido. */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Padding alrededor del contenido. */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Contenido de la pagina. */
  children: React.ReactNode;
  /** Clase adicional. */
  className?: string;
}

export function PageContainer({
  maxWidth = 'lg',
  padding = 'md',
  children,
  className,
}: PageContainerProps) {
  const classes = [
    styles.container,
    styles[`maxWidth-${maxWidth}`],
    styles[`padding-${padding}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
}
