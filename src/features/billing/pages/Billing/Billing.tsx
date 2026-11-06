import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  FileText,
  Search,
  DollarSign,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Table, type TableColumn } from '../../../../components/common/data-display/Table';
import { Badge } from '../../../../components/common/data-display/Badge';
import { Button } from '../../../../components/common/actions/Button';
import { Input } from '../../../../components/common/inputs/Input';
import { Select } from '../../../../components/common/inputs/Select';
import { Skeleton } from '../../../../components/feedback/loading/Skeleton';
import { EmptyState } from '../../../../components/feedback/states/EmptyState';
import { useInvoicesStore, type Invoice, type InvoiceStatus } from '../../../../stores';
import { useToast } from '../../../../components/feedback/alerts/Toast';
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
  return d + '/' + m + '/' + y;
};

interface MenuPosition {
  top: number;
  right: number;
}

export default function Billing() {
  const navigate = useNavigate();
  const invoices = useInvoicesStore((s) => s.invoices);
  const updateStatus = useInvoicesStore((s) => s.updateStatus);
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({ top: 0, right: 0 });

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // Cierra el menu al hacer scroll o resize (para que no quede flotando mal posicionado)
  useEffect(() => {
    if (openMenuId === null) return;
    const close = () => setOpenMenuId(null);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [openMenuId]);

  const handleOpenMenu = (
    invoiceId: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (openMenuId === invoiceId) {
      setOpenMenuId(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 4,
      right: window.innerWidth - rect.right,
    });
    setOpenMenuId(invoiceId);
  };

  const handleStatusChange = (invoiceId: number, status: InvoiceStatus) => {
    const invoice = invoices.find((i) => i.id === invoiceId);
    updateStatus(invoiceId, status);
    setOpenMenuId(null);

    if (invoice) {
      const statusLabel =
        status === 'paid'
          ? 'pagada'
          : status === 'pending'
          ? 'pendiente'
          : 'vencida';
      const toastVariant =
        status === 'paid'
          ? 'success'
          : status === 'pending'
          ? 'info'
          : 'warning';

      toast[toastVariant](
        'Factura ' + invoice.number + ' marcada como ' + statusLabel,
        'Cliente: ' + invoice.client + ' · Total: ' + formatBs(invoice.total),
        { category: 'billing', actionUrl: '/billing' }
      );
    }
  };

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
          aria-label={'Acciones para ' + inv.number}
          onClick={(e) => {
            e.stopPropagation();
            handleOpenMenu(inv.id, e);
          }}
        >
          <MoreVertical size={16} />
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
            description="Prueba con otro termino de busqueda o cambia el filtro de estado."
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

  const activeInvoice = openMenuId !== null
    ? invoices.find((i) => i.id === openMenuId)
    : null;

  const menuPortal = openMenuId !== null && activeInvoice
    ? createPortal(
        <>
          <div
            className={styles.menuBackdrop}
            onClick={() => setOpenMenuId(null)}
            aria-hidden="true"
          />
          <div
            className={styles.menu}
            style={{ top: menuPosition.top, right: menuPosition.right }}
            role="menu"
          >
            {activeInvoice.status !== 'paid' && (
              <button
                type="button"
                className={styles.menuItem}
                onClick={() => handleStatusChange(activeInvoice.id, 'paid')}
              >
                <CheckCircle2 size={14} />
                Marcar como pagada
              </button>
            )}
            {activeInvoice.status !== 'pending' && (
              <button
                type="button"
                className={styles.menuItem}
                onClick={() => handleStatusChange(activeInvoice.id, 'pending')}
              >
                <Clock size={14} />
                Marcar como pendiente
              </button>
            )}
            {activeInvoice.status === 'pending' && (
              <button
                type="button"
                className={styles.menuItem}
                onClick={() => handleStatusChange(activeInvoice.id, 'overdue')}
              >
                <AlertCircle size={14} />
                Marcar como vencida
              </button>
            )}
          </div>
        </>,
        document.body
      )
    : null;

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

      {menuPortal}
    </div>
  );
}





