import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Search, DollarSign, MoreVertical, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Table, type TableColumn } from '../../../../components/common/data-display/Table';
import { Badge } from '../../../../components/common/data-display/Badge';
import { Button } from '../../../../components/common/actions/Button';
import { Input } from '../../../../components/common/inputs/Input';
import { Select } from '../../../../components/common/inputs/Select';
import { Skeleton } from '../../../../components/feedback/loading/Skeleton';
import { EmptyState } from '../../../../components/feedback/states/EmptyState';
import { useInvoicesStore, type Invoice, type InvoiceStatus } from '../../../../stores';
import styles from './Billing.module.css';

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
  const invoices = useInvoicesStore((s) => s.invoices);
  const updateStatus = useInvoicesStore((s) => s.updateStatus);

  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
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
      width: '100px',
      render: (inv) => (
        <div className={styles.actionsCell}>
          <Button
            variant="ghost"
            size="sm"
            iconOnly
            aria-label={`Acciones para ${inv.number}`}
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(openMenuId === inv.id ? null : inv.id);
            }}
          >
            <MoreVertical size={16} />
          </Button>
          {openMenuId === inv.id && (
            <>
              <div
                className={styles.menuBackdrop}
                onClick={() => setOpenMenuId(null)}
                aria-hidden="true"
              />
              <div className={styles.menu}>
                {inv.status !== 'paid' && (
                  <button
                    type="button"
                    className={styles.menuItem}
                    onClick={() => {
                      updateStatus(inv.id, 'paid');
                      setOpenMenuId(null);
                    }}
                  >
                    <CheckCircle2 size={14} />
                    Marcar como pagada
                  </button>
                )}
                {inv.status !== 'pending' && (
                  <button
                    type="button"
                    className={styles.menuItem}
                    onClick={() => {
                      updateStatus(inv.id, 'pending');
                      setOpenMenuId(null);
                    }}
                  >
                    <Clock size={14} />
                    Marcar como pendiente
                  </button>
                )}
                {inv.status === 'pending' && (
                  <button
                    type="button"
                    className={styles.menuItem}
                    onClick={() => {
                      updateStatus(inv.id, 'overdue');
                      setOpenMenuId(null);
                    }}
                  >
                    <AlertCircle size={14} />
                    Marcar como vencida
                  </button>
                )}
              </div>
            </>
          )}
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
        <div className={styles.emptyWrapper}>
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
        </div>
      );
    }

    if (filtered.length === 0) {
      return (
        <div className={styles.emptyWrapper}>
          <EmptyState
            title="No se encontraron facturas"
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



