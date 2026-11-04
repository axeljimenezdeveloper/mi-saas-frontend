import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, FileText, Search, DollarSign } from 'lucide-react';
import { Table, type TableColumn } from '../../../../components/common/data-display/Table';
import { Badge } from '../../../../components/common/data-display/Badge';
import { Button } from '../../../../components/common/actions/Button';
import { Input } from '../../../../components/common/inputs/Input';
import { Select } from '../../../../components/common/inputs/Select';
import { Skeleton } from '../../../../components/feedback/loading/Skeleton';
import { EmptyState } from '../../../../components/feedback/states/EmptyState';
import styles from './Billing.module.css';

type InvoiceStatus = 'paid' | 'pending' | 'overdue';

interface Invoice {
  id: number;
  number: string;
  client: string;
  date: string;
  total: number;
  status: InvoiceStatus;
}

const MOCK_INVOICES: Invoice[] = [
  { id: 1, number: 'FAC-2026-0001', client: 'Carlos Rodriguez', date: '2026-11-01', total: 1250.0, status: 'paid' },
  { id: 2, number: 'FAC-2026-0002', client: 'Maria Gonzalez', date: '2026-11-02', total: 840.5, status: 'pending' },
  { id: 3, number: 'FAC-2026-0003', client: 'Pedro Martinez', date: '2026-11-02', total: 3200.0, status: 'paid' },
  { id: 4, number: 'FAC-2026-0004', client: 'Ana Lopez', date: '2026-10-28', total: 450.0, status: 'overdue' },
  { id: 5, number: 'FAC-2026-0005', client: 'Luis Hernandez', date: '2026-11-03', total: 1890.75, status: 'pending' },
  { id: 6, number: 'FAC-2026-0006', client: 'Carmen Diaz', date: '2026-11-04', total: 620.0, status: 'paid' },
];

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  paid: 'Pagada',
  pending: 'Pendiente',
  overdue: 'Vencida',
};

const STATUS_VARIANTS: Record<InvoiceStatus, 'success' | 'warning' | 'danger'> = {
  paid: 'success',
  pending: 'warning',
  overdue: 'danger',
};

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todas las facturas' },
  { value: 'paid', label: 'Pagadas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'overdue', label: 'Vencidas' },
];

const formatBs = (amount: number): string =>
  new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES',
    minimumFractionDigits: 2,
  }).format(amount);

const formatDate = (iso: string): string => {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

export default function Billing() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const t = setTimeout(() => {
      setIsLoading(false);
      setInvoices(MOCK_INVOICES);
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch =
        search.trim() === '' ||
        inv.client.toLowerCase().includes(search.toLowerCase()) ||
        inv.number.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, search, statusFilter]);

  const columns: TableColumn<Invoice>[] = [
    {
      key: 'number',
      header: 'Factura',
      render: (inv) => (
        <div className={styles.invoiceCell}>
          <div className={styles.invoiceIcon}>
            <FileText size={18} />
          </div>
          <span className={styles.invoiceNumber}>{inv.number}</span>
        </div>
      ),
    },
    {
      key: 'client',
      header: 'Cliente',
    },
    {
      key: 'date',
      header: 'Fecha',
      render: (inv) => formatDate(inv.date),
    },
    {
      key: 'total',
      header: 'Total',
      align: 'right',
      render: (inv) => (
        <span className={styles.totalCell}>{formatBs(inv.total)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (inv) => (
        <Badge variant={STATUS_VARIANTS[inv.status]} withDot size="sm">
          {STATUS_LABELS[inv.status]}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      width: '80px',
      render: (inv) => (
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          aria-label={`Ver ${inv.number}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Eye size={14} />
        </Button>
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
              <Skeleton width="20%" height="12px" />
              <Skeleton width="25%" height="12px" />
              <Skeleton width="15%" height="12px" />
              <Skeleton width="80px" height="20px" />
            </div>
          ))}
        </div>
      );
    }

    if (invoices.length === 0) {
      return (
        <EmptyState
          title="No hay facturas registradas"
          description="Crea tu primera factura para comenzar a facturar a tus clientes."
          icon={<DollarSign size={32} />}
          action={
            <Button
              leftIcon={<Plus size={14} />}
              onClick={() => navigate('/billing/new')}
            >
              Crear primera factura
            </Button>
          }
        />
      );
    }

    if (filtered.length === 0) {
      return (
        <EmptyState
          title="No se encontraron facturas"
          description="Prueba con otro término de búsqueda o cambia el filtro de estado."
          icon={<Search size={32} />}
        />
      );
    }

    return (
      <Table
        columns={columns}
        data={filtered}
        getRowKey={(inv) => inv.id}
        emptyMessage="No hay facturas"
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
                placeholder="Buscar por cliente o numero..."
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
            onClick={() => navigate('/billing/new')}
          >
            Nueva factura
          </Button>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
