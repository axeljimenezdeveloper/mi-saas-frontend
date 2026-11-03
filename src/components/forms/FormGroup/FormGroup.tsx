import styles from './FormGroup.module.css';

export interface FormGroupProps {
  /** Titulo de la seccion. */
  title: string;
  /** Descripcion opcional debajo del titulo. */
  description?: string;
  /** Contenido del grupo (usualmente FormField o controles). */
  children: React.ReactNode;
  /** Layout de los hijos: columna, grid 2 columnas o grid 3 columnas. */
  layout?: 'stack' | 'two-columns' | 'three-columns';
  /** Si es true, los hijos ocupan el ancho completo del grupo (grid-column: 1/-1). */
  fullWidthChildren?: boolean;
  /** Clase adicional. */
  className?: string;
}

export function FormGroup({
  title,
  description,
  children,
  layout = 'stack',
  className,
}: FormGroupProps) {
  const classes = [styles.group, className].filter(Boolean).join(' ');
  const contentClasses = [styles.content, styles[layout]].join(' ');

  return (
    <section className={classes}>
      <header className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
      </header>
      <div className={contentClasses}>{children}</div>
    </section>
  );
}
