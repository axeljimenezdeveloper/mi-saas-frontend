import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Package, Search } from 'lucide-react';
import { Table, type TableColumn } from '../../../../components/common/data-display/Table';
import { Badge } from '../../../../components/common/data-display/Badge';
import { Button } from '../../../../components/common/actions/Button';
import { Input } from '../../../../components/common/inputs/Input';
import { Select } from '../../../../components/common/inputs/Select';
import { Skeleton } from '../../../../components/feedback/loading/Skeleton';
import { EmptyState } from '../../../../components/feedback/states/EmptyState';
import { useToast } from '../../../../components/feedback/alerts/Toast';
import { useProductsStore, type Product, type StockStatus } from '../../../../stores';
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
  const removeProduct = useProductsStore((s) => s.removeProduct);

  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

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

  const handleDelete = (product: Product) => {
    removeProduct(product.id);
    toast.success('Producto eliminado', `${product.name} se quito del inventario`);
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
            aria-label={`Editar ${p.name}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Pencil size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            aria-label={`Eliminar ${p.name}`}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(p);
            }}
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
            description="Comienza agregando tu primer producto al inventario para poder facturarlo."
            icon={<Package size={32} />}
            action={
              <Button
                leftIcon={<Plus size={14} />}
                onClick={() => navigate('/products/new')}
              >
                Crear primer producto
              </Button>
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
            description="Prueba con otro término de búsqueda o cambia el filtro de estado."
            icon={<Search size={32} />}
          />
        </div>
      );
    }

    return (
      <Table
        columns={columns}
        data={filtered}
        getRowKey={(p) => p.id}
        emptyMessage="No hay productos registrados"
      />
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

        {renderContent()}
      </div>
    </div>
  );
}


