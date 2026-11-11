import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  Search,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  PackagePlus,
} from 'lucide-react';
import { Table, type TableColumn } from '../../../../components/common/data-display/Table';
import { Badge } from '../../../../components/common/data-display/Badge';
import { Button } from '../../../../components/common/actions/Button';
import { Input } from '../../../../components/common/inputs/Input';
import { Select } from '../../../../components/common/inputs/Select';
import { Skeleton } from '../../../../components/feedback/loading/Skeleton';
import { EmptyState } from '../../../../components/feedback/states/EmptyState';
import { ConfirmDialog } from '../../../../components/common/overlay/ConfirmDialog';
import { Pagination } from '../../../../components/common/navigation/Pagination';
import { useToast } from '../../../../components/feedback/alerts/Toast';
import {
  useProductsStore,
  useCompanyStore,
  type Product,
  type StockStatus,
} from '../../../../stores';
import { generateSampleProducts } from '../../../demo/sampleProducts';
import styles from './ProductsList.module.css';

const STATUS_LABELS: Record<StockStatus, string> = {
  'in-stock': 'En stock',
  'low-stock': 'Stock bajo',
  'out-of-stock': 'Agotado',
};

const STATUS_VARIANTS: Record<StockStatus, 'success' | 'warning' | 'danger'> = {
  'in-stock': 'success',
  'low-stock': 'warning',
  'out-of-stock': 'danger',
};

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'in-stock', label: 'En stock' },
  { value: 'low-stock', label: 'Stock bajo' },
  { value: 'out-of-stock', label: 'Agotados' },
];

const ITEMS_PER_PAGE = 10;

type SortField = 'name' | 'price' | 'stock' | null;
type SortDirection = 'asc' | 'desc';

const formatBs = (amount: number): string =>
  new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES',
    minimumFractionDigits: 2,
  }).format(amount);

export default function ProductsList() {
  const navigate = useNavigate();
  const toast = useToast();

  const products = useProductsStore((s) => s.products);
  const isLoading = useProductsStore((s) => s.isLoading);
  const removeProduct = useProductsStore((s) => s.removeProduct);
  const addProduct = useProductsStore((s) => s.addProduct);
  const currency = useCompanyStore((s) => s.preferences.currency);

  const [isGenerating, setIsGenerating] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');


  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        search.trim() === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  const sorted = useMemo(() => {
    if (!sortField) return filtered;
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') {
        cmp = a.name.localeCompare(b.name);
      } else if (sortField === 'price') {
        cmp = a.price - b.price;
      } else if (sortField === 'stock') {
        cmp = a.stock - b.stock;
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDirection]);

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sorted.slice(start, start + ITEMS_PER_PAGE);
  }, [sorted, currentPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortField(null);
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown size={12} className={styles.sortIcon} />;
    if (sortDirection === 'asc') return <ArrowUp size={12} className={styles.sortIconActive} />;
    return <ArrowDown size={12} className={styles.sortIconActive} />;
  };

  const handleConfirmDelete = () => {
    if (!productToDelete) return;
    removeProduct(productToDelete.id);
    toast.success(
      'Producto eliminado',
      productToDelete.name + ' se quito del inventario',
      { category: 'inventory' }
    );
    setProductToDelete(null);
    // Si al borrar se queda vacia la pagina actual, ir a la anterior
    if (paginated.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleGenerateSamples = () => {
    setIsGenerating(true);
    const samples = generateSampleProducts(currency);
    samples.forEach((product) => addProduct(product));
    toast.success(
      '16 productos de ejemplo creados',
      'Explora la tabla, filtra por estado y crea facturas',
      { category: 'inventory' }
    );
    setIsGenerating(false);
  };

  const columns: TableColumn<Product>[] = [
    {
      key: 'name',
      header: 'Producto',
      render: (p) => (
        <div className={styles.productCell}>
          <div className={styles.productIcon}>
            {p.images && p.images.length > 0 ? (
              <img
                src={p.images[0]}
                alt=""
                className={styles.productThumb}
              />
            ) : (
              <Package size={18} />
            )}
          </div>
          <div>
            <div className={styles.productName}>{p.name}</div>
            <div className={styles.productSku}>{p.sku || 'Sin SKU'}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Categoria',
    },
    {
      key: 'price',
      header: 'Precio',
      align: 'right',
      render: (p) => formatBs(p.price),
    },
    {
      key: 'stock',
      header: 'Stock',
      align: 'center',
      render: (p) => <span className={styles.stockNumber}>{p.stock}</span>,
    },
    {
      key: 'status',
      header: 'Estado',
      render: (p) => (
        <Badge variant={STATUS_VARIANTS[p.status]} withDot size="sm">
          {STATUS_LABELS[p.status]}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      width: '120px',
      render: (p) => (
        <div className={styles.actions}>
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            aria-label={'Editar ' + p.name}
            onClick={(e) => {
              e.stopPropagation();
              navigate('/products/' + p.id + '/edit');
            }}
          >
            <Pencil size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            aria-label={'Eliminar ' + p.name}
            onClick={(e) => {
              e.stopPropagation();
              setProductToDelete(p);
            }}
            className={styles.deleteButton}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.skeletonTable}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={styles.skeletonRow}>
              <Skeleton variant="circular" width="36px" height="36px" />
              <div className={styles.skeletonRowContent}>
                <Skeleton width="60%" height="12px" />
                <Skeleton width="40%" height="10px" />
              </div>
              <Skeleton width="80px" height="12px" />
              <Skeleton width="60px" height="12px" />
            </div>
          ))}
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className={styles.emptyWrapper}>
          <EmptyState
            title="No hay productos registrados"
            description="Comienza agregando tu primer producto o genera una muestra de 16 productos para explorar la interfaz."
            icon={<Package size={32} />}
            action={
              <div className={styles.emptyActions}>
                <Button
                  leftIcon={<Plus size={14} />}
                    fullWidth
                  onClick={() => navigate('/products/new')}
                >
                  Crear primer producto
                </Button>
                <Button
                  variant="outline"
                  leftIcon={<PackagePlus size={14} />}
                    fullWidth
                  onClick={handleGenerateSamples}
                  isLoading={isGenerating}
                >
                  Generar productos
                </Button>
              </div>
            }
          />
        </div>
      );
    }

    if (filtered.length === 0) {
      return (
        <div className={styles.emptyWrapper}>
          <EmptyState
            title="No se encontraron productos"
            description="Prueba con otro termino de busqueda o cambia el filtro de estado."
            icon={<Search size={32} />}
          />
        </div>
      );
    }

    return (
      <>
        <Table
          columns={columns}
          data={paginated}
          getRowKey={(p) => p.id}
          emptyMessage="No hay productos registrados"
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={sorted.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <div className={styles.searchWrapper}>
              <Input
                placeholder="Buscar por nombre, SKU o categoria..."
                leftIcon={<Search size={16} />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="sm"
              />
            </div>
            <div className={styles.filterWrapper}>
              <Select
                options={STATUS_OPTIONS}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                size="sm"
              />
            </div>
          </div>
          <Button
            leftIcon={<Plus size={14} />}
            onClick={() => navigate('/products/new')}
          >
            Nuevo producto
          </Button>
        </div>

        <div className={styles.sortBar}>
          <span className={styles.sortLabel}>Ordenar por:</span>
          <button
            type="button"
            className={[styles.sortButton, sortField === 'name' && styles.sortButtonActive].filter(Boolean).join(' ')}
            onClick={() => handleSort('name')}
          >
            Nombre {getSortIcon('name')}
          </button>
          <button
            type="button"
            className={[styles.sortButton, sortField === 'price' && styles.sortButtonActive].filter(Boolean).join(' ')}
            onClick={() => handleSort('price')}
          >
            Precio {getSortIcon('price')}
          </button>
          <button
            type="button"
            className={[styles.sortButton, sortField === 'stock' && styles.sortButtonActive].filter(Boolean).join(' ')}
            onClick={() => handleSort('stock')}
          >
            Stock {getSortIcon('stock')}
          </button>
        </div>

        {renderContent()}
      </div>

      <ConfirmDialog
        isOpen={productToDelete !== null}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar producto"
        message={
          <>
            ¿Estas seguro que quieres eliminar{' '}
            <strong>{productToDelete?.name}</strong>?
            <br />
            Esta accion no se puede deshacer.
          </>
        }
        confirmLabel="Si, eliminar"
        cancelLabel="Cancelar"
        variant="danger"
      />
    </div>
  );
}
