import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { Table, type TableColumn } from '../../../../components/common/data-display/Table';
import { Badge } from '../../../../components/common/data-display/Badge';
import { Card } from '../../../../components/common/data-display/Card';
import { Button } from '../../../../components/common/actions/Button';
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

const formatBs = (amount: number): string =>
  new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES',
    minimumFractionDigits: 2,
  }).format(amount);

export default function ProductsList() {
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
      render: (p) => (
        <span className={styles.stockNumber}>{p.stock}</span>
      ),
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

  return (
    <Card padding="none">
      <div className={styles.toolbar}>
        <div>
          <h2 className={styles.title}>Inventario</h2>
          <p className={styles.subtitle}>
            {MOCK_PRODUCTS.length} productos registrados
          </p>
        </div>
        <Button leftIcon={<Plus size={14} />}>Nuevo producto</Button>
      </div>
      <Table
        columns={columns}
        data={MOCK_PRODUCTS}
        getRowKey={(p) => p.id}
        emptyMessage="No hay productos registrados"
      />
    </Card>
  );
}
