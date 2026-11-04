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
import styles from './ProductsList.module.css';

type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: StockStatus;
}

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Camisa azul talla M', sku: 'CAM-AZ-M-001', category: 'Ropa', price: 25.0, stock: 42, status: 'in-stock' },
  { id: 2, name: 'Pantalon negro talla 32', sku: 'PAN-NE-32-002', category: 'Ropa', price: 40.0, stock: 8, status: 'low-stock' },
  { id: 3, name: 'Zapatos deportivos', sku: 'ZAP-DEP-003', category: 'Calzado', price: 60.0, stock: 0, status: 'out-of-stock' },
  { id: 4, name: 'Gorra bordada', sku: 'GOR-BOR-004', category: 'Accesorios', price: 15.0, stock: 120, status: 'in-stock' },
  { id: 5, name: 'Bufanda de lana', sku: 'BUF-LAN-005', category: 'Accesorios', price: 18.0, stock: 5, status: 'low-stock' },
  { id: 6, name: 'Chaqueta de cuero', sku: 'CHA-CUE-006', category: 'Ropa', price: 95.0, stock: 15, status: 'in-stock' },
  { id: 7, name: 'Cinturon de cuero', sku: 'CIN-CUE-007', category: 'Accesorios', price: 22.0, stock: 3, status: 'low-stock' },
];

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
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const t = setTimeout(() => {
      setIsLoading(false);
      setProducts(MOCK_PRODUCTS);
    }, 1200);
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

  const columns: TableColumn<Product>[] = [
    {
      key: 'name',
      header: 'Producto',
      render: (p) => (
        <div className={styles.productCell}>
          <div className={styles.productIcon}>
            <Package size={18} />
          </div>
          <div>
            <div className={styles.productName}>{p.name}</div>
            <div className={styles.productSku}>{p.sku}</div>
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
            onClick={(e) => e.stopPropagation()}
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
      );
    }

    if (filtered.length === 0) {
      return (
        <EmptyState
          title="No se encontraron productos"
          description="Prueba con otro término de búsqueda o cambia el filtro de estado."
          icon={<Search size={32} />}
        />
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
