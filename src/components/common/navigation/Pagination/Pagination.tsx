import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '../../actions/Button';
import styles from './Pagination.module.css';

export interface PaginationProps {
  /** Pagina actual (1-indexed). */
  currentPage: number;
  /** Total de paginas. */
  totalPages: number;
  /** Callback al cambiar de pagina. */
  onPageChange: (page: number) => void;
  /** Total de items (para el indicador "Mostrando X-Y de Z"). */
  totalItems: number;
  /** Items por pagina (para calcular el rango mostrado). */
  itemsPerPage: number;
  /** Clase adicional. */
  className?: string;
}

const MAX_VISIBLE_PAGES = 5;

/**
 * Genera la lista de paginas a mostrar con ellipsis.
 * Ej: [1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]
 */
function getPageNumbers(
  currentPage: number,
  totalPages: number
): (number | 'ellipsis')[] {
  if (totalPages <= MAX_VISIBLE_PAGES + 2) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];

  // Primera pagina siempre
  pages.push(1);

  const leftSibling = Math.max(2, currentPage - 1);
  const rightSibling = Math.min(totalPages - 1, currentPage + 1);

  // Ellipsis izquierdo
  if (leftSibling > 2) {
    pages.push('ellipsis');
  }

  // Rango de paginas alrededor de la actual
  for (let i = leftSibling; i <= rightSibling; i++) {
    pages.push(i);
  }

  // Ellipsis derecho
  if (rightSibling < totalPages - 1) {
    pages.push('ellipsis');
  }

  // Ultima pagina siempre
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className,
}: PaginationProps) {
  const isDisabled = totalPages <= 1;

  const from = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const to = Math.min(currentPage * itemsPerPage, totalItems);

  const pages = isDisabled ? [] : getPageNumbers(currentPage, totalPages);

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const wrapperClasses = [styles.wrapper, className].filter(Boolean).join(' ');

  return (
    <nav
      className={wrapperClasses}
      aria-label="Paginacion"
      aria-disabled={isDisabled}
    >
      <p className={styles.range} aria-live="polite">
        {totalItems === 0
          ? 'Sin resultados'
          : 'Mostrando ' + from + '-' + to + ' de ' + totalItems}
      </p>

      {!isDisabled && (
        <div className={styles.controls}>
          <Button
            variant="outline"
            size="sm"
            iconOnly
            aria-label="Pagina anterior"
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </Button>

          <ul className={styles.pages}>
            {pages.map((p, idx) =>
              p === 'ellipsis' ? (
                <li key={'ellipsis-' + idx} className={styles.ellipsis}>
                  <MoreHorizontal size={14} />
                </li>
              ) : (
                <li key={p}>
                  <button
                    type="button"
                    className={[
                      styles.pageButton,
                      p === currentPage && styles.active,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => onPageChange(p)}
                    aria-label={'Ir a pagina ' + p}
                    aria-current={p === currentPage ? 'page' : undefined}
                  >
                    {p}
                  </button>
                </li>
              )
            )}
          </ul>

          <Button
            variant="outline"
            size="sm"
            iconOnly
            aria-label="Pagina siguiente"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </nav>
  );
}
