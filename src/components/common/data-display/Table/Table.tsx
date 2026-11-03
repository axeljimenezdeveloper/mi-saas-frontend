import styles from './Table.module.css';

export interface TableColumn<T> {
  /** Identificador unico de la columna (usado como key y como acceso al campo). */
  key: string;
  /** Texto del encabezado. */
  header: string;
  /** Funcion personalizada para renderizar el contenido de la celda. */
  render?: (row: T) => React.ReactNode;
  /** Alineacion del texto. */
  align?: 'left' | 'center' | 'right';
  /** Ancho de la columna (CSS, ej. "120px", "20%"). */
  width?: string;
}

export interface TableProps<T> {
  /** Definicion de columnas. */
  columns: TableColumn<T>[];
  /** Filas de datos. */
  data: T[];
  /** Funcion que devuelve una key unica por fila. */
  getRowKey: (row: T) => string | number;
  /** Si es true, muestra un estado de carga en lugar de las filas. */
  isLoading?: boolean;
  /** Mensaje mostrado cuando data esta vacia. */
  emptyMessage?: string;
  /** Handler opcional al hacer click en una fila. */
  onRowClick?: (row: T) => void;
  /** Si es true, las filas se iluminan al pasar el mouse. */
  hoverable?: boolean;
}

export function Table<T>({
  columns,
  data,
  getRowKey,
  isLoading = false,
  emptyMessage = 'No hay datos para mostrar',
  onRowClick,
  hoverable = true,
}: TableProps<T>) {
  const getCellValue = (row: T, column: TableColumn<T>): React.ReactNode => {
    if (column.render) return column.render(row);
    return String((row as Record<string, unknown>)[column.key] ?? '');
  };

  const showStateRow = isLoading || data.length === 0;

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={styles.th}
                style={{
                  textAlign: col.align ?? 'left',
                  width: col.width,
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {showStateRow ? (
            <tr>
              <td colSpan={columns.length} className={styles.stateCell}>
                {isLoading ? 'Cargando...' : emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={getRowKey(row)}
                className={[
                  styles.tr,
                  hoverable && styles.hoverable,
                  onRowClick && styles.clickable,
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={styles.td}
                    style={{ textAlign: col.align ?? 'left' }}
                  >
                    {getCellValue(row, col)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
