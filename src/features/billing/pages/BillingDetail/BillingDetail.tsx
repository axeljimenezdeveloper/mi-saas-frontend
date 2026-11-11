import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  Package,
  Trash2,
  Download,
} from 'lucide-react';
import { Card } from '../../../../components/common/data-display/Card';
import { Badge } from '../../../../components/common/data-display/Badge';
import { Button } from '../../../../components/common/actions/Button';
import { EmptyState } from '../../../../components/feedback/states/EmptyState';
import { ConfirmDialog } from '../../../../components/common/overlay/ConfirmDialog';
import { useToast } from '../../../../components/feedback/alerts/Toast';
import { useInvoicesStore, useCompanyStore } from '../../../../stores';
import { formatMoney } from '../../../../utils/formatters';
import type { InvoiceStatus } from '../../../../stores/invoicesStore';
import { USE_BACKEND } from '../../../../config/backend';
import { downloadInvoicePdfRequest } from '../../../../api/billing';
import styles from './BillingDetail.module.css';

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


const formatDate = (iso: string): string => {
  const [y, m, d] = iso.split('-');
  return d + '/' + m + '/' + y;
};

export default function BillingDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

  const invoices = useInvoicesStore((s) => s.invoices);
  const updateStatus = useInvoicesStore((s) => s.updateStatus);
  const removeInvoice = useInvoicesStore((s) => s.removeInvoice);

  const companyName = useCompanyStore((s) => s.company.name);
  const companyRif = useCompanyStore((s) => s.company.rif);
  const companyAddress = useCompanyStore((s) => s.company.address);
  const defaultIva = useCompanyStore((s) => s.preferences.defaultIva);
  const currency = useCompanyStore((s) => s.preferences.currency);
  const formatBs = (amount: number) => formatMoney(amount, currency);
  const ivaRate = Number(defaultIva) / 100;

  const invoice = useMemo(
    () => invoices.find((i) => String(i.id) === id),
    [invoices, id]
  );

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const totals = useMemo(() => {
    if (!invoice) return { subtotal: 0, iva: 0 };
    const subtotal = invoice.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    return {
      subtotal,
      iva: subtotal * ivaRate,
    };
  }, [invoice, ivaRate]);

  const handleStatusChange = (status: InvoiceStatus) => {
    if (!invoice) return;
    updateStatus(invoice.id, status);

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
      'Cliente: ' + invoice.client,
      { category: 'billing', actionUrl: '/billing/' + invoice.id }
    );
  };

  const handleDelete = () => {
    if (!invoice) return;
    removeInvoice(invoice.id);
    toast.success(
      'Factura eliminada',
      invoice.number + ' se elimino del historial',
      { category: 'billing' }
    );
    navigate('/billing');
  };

  const handleDownloadPdf = async () => {
    if (!invoice) return;
    setIsGeneratingPdf(true);
    try {
      const blob = await downloadInvoicePdfRequest(invoice.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice.number}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      // El endpoint ya persistio pdfUrl en la DB. Refrescamos para que el
      // iframe preview aparezca en el proximo render.
      await useInvoicesStore.getState().fetchInvoices();

      toast.success(
        'PDF descargado',
        'La factura ' + invoice.number + ' se descargo correctamente'
      );
    } catch {
      toast.error(
        'Error al generar PDF',
        'No se pudo generar el PDF de la factura'
      );
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!invoice) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyWrapper}>
          <EmptyState
            title="Factura no encontrada"
            description="La factura que buscas no existe o fue eliminada."
            icon={<FileText size={32} />}
            action={
              <Button
                leftIcon={<ArrowLeft size={14} />}
                onClick={() => navigate('/billing')}
              >
                Volver a facturacion
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <button
              type="button"
              className={styles.backButton}
              onClick={() => navigate('/billing')}
              aria-label="Volver"
              title="Volver a facturacion"
            >
              <ArrowLeft size={18} />
            </button>
            <div className={styles.titleBlock}>
              <div className={styles.titleRow}>
                <h1 className={styles.title}>{invoice.number}</h1>
                <Badge variant={STATUS_VARIANTS[invoice.status]} withDot size="md">
                  {STATUS_LABELS[invoice.status]}
                </Badge>
              </div>
              <p className={styles.subtitle}>
                Factura emitida el {formatDate(invoice.date)}
              </p>
            </div>
          </div>
          <div className={styles.headerActions}>
            {invoice.status !== 'paid' && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<CheckCircle2 size={14} />}
                onClick={() => handleStatusChange('paid')}
              >
                Marcar pagada
              </Button>
            )}
            {invoice.status !== 'pending' && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Clock size={14} />}
                onClick={() => handleStatusChange('pending')}
              >
                Marcar pendiente
              </Button>
            )}
            {invoice.status === 'pending' && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<AlertCircle size={14} />}
                onClick={() => handleStatusChange('overdue')}
              >
                Marcar vencida
              </Button>
            )}
            <Button
              variant="danger"
              size="sm"
              iconOnly
              aria-label="Eliminar factura"
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.mainGrid}>
          {/* Columna izquierda: Emisor + Cliente */}
          <div className={styles.infoColumn}>
            <Card padding="md">
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>
                  <Receipt size={18} />
                </div>
                <h2 className={styles.sectionTitle}>Emisor</h2>
              </div>
              <dl className={styles.infoList}>
                <div className={styles.infoRow}>
                  <dt className={styles.infoLabel}>Razon social</dt>
                  <dd className={styles.infoValue}>{companyName || 'Sin configurar'}</dd>
                </div>
                <div className={styles.infoRow}>
                  <dt className={styles.infoLabel}>RIF</dt>
                  <dd className={styles.infoValue}>{companyRif || '-'}</dd>
                </div>
                {companyAddress && (
                  <div className={styles.infoRow}>
                    <dt className={styles.infoLabel}>Direccion</dt>
                    <dd className={styles.infoValue}>{companyAddress}</dd>
                  </div>
                )}
              </dl>
            </Card>

            <Card padding="md">
              <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>
                  <User size={18} />
                </div>
                <h2 className={styles.sectionTitle}>Cliente</h2>
              </div>
              <dl className={styles.infoList}>
                <div className={styles.infoRow}>
                  <dt className={styles.infoLabel}>Nombre</dt>
                  <dd className={styles.infoValue}>{invoice.client}</dd>
                </div>
                <div className={styles.infoRow}>
                  <dt className={styles.infoLabel}>
                    <Calendar size={14} />
                    Fecha de emision
                  </dt>
                  <dd className={styles.infoValue}>{formatDate(invoice.date)}</dd>
                </div>
              </dl>
            </Card>
          </div>

          {/* Columna derecha: PDF */}
          <Card padding="md" className={styles.pdfColumn}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <FileText size={18} />
              </div>
              <h2 className={styles.sectionTitle}>Vista previa de la factura</h2>
            </div>

            {invoice.pdfUrl ? (
              <div className={styles.pdfWrapper}>
                <iframe
                  src={invoice.pdfUrl}
                  title={'Factura ' + invoice.number}
                  className={styles.pdfFrame}
                />
                <div className={styles.pdfActions}>
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Download size={14} />}
                    onClick={handleDownloadPdf}
                    isLoading={isGeneratingPdf}
                  >
                    Descargar PDF
                  </Button>
                </div>
              </div>
            ) : USE_BACKEND ? (
              <div className={styles.pdfPlaceholder}>
                <div className={styles.pdfPlaceholderIcon}>
                  <FileText size={32} />
                </div>
                <h3 className={styles.pdfPlaceholderTitle}>Factura PDF</h3>
                <p className={styles.pdfPlaceholderText}>
                  Genera el PDF de esta factura para descargarla o imprimirla.
                </p>
                <Button
                  variant="primary"
                  size="md"
                  leftIcon={<Download size={14} />}
                  onClick={handleDownloadPdf}
                  isLoading={isGeneratingPdf}
                >
                  Generar y descargar PDF
                </Button>
              </div>
            ) : (
              <div className={styles.pdfPlaceholder}>
                <div className={styles.pdfPlaceholderIcon}>
                  <FileText size={32} />
                </div>
                <h3 className={styles.pdfPlaceholderTitle}>
                  PDF disponible proximamente
                </h3>
                <p className={styles.pdfPlaceholderText}>
                  La factura en PDF con formato fiscal se generara automaticamente
                  cuando se conecte el backend.
                </p>
                <span className={styles.pdfPlaceholderBadge}>
                  Vista previa del documento
                </span>
              </div>
            )}
          </Card>
        </div>

        {/* ============ ITEMS ============ */}
        <Card padding="none">
          <div className={styles.itemsHeader}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <Package size={18} />
              </div>
              <h2 className={styles.sectionTitle}>Productos</h2>
            </div>
            <span className={styles.itemsCount}>
              {invoice.items.length} producto{invoice.items.length === 1 ? '' : 's'}
            </span>
          </div>

          {invoice.items.length === 0 ? (
            <div className={styles.emptyItems}>
              <p>Esta factura no tiene productos registrados.</p>
            </div>
          ) : (
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className={styles.alignRight}>Precio</th>
                  <th className={styles.alignCenter}>Cant.</th>
                  <th className={styles.alignRight}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.productId}>
                    <td>{item.productName}</td>
                    <td className={styles.alignRight}>{formatBs(item.price)}</td>
                    <td className={styles.alignCenter}>{item.quantity}</td>
                    <td className={styles.alignRight}>
                      {formatBs(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        {/* ============ TOTALES ============ */}
        <Card padding="md">
          <div className={styles.totalsWrapper}>
            <div className={styles.totalsBox}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Subtotal</span>
                <span className={styles.totalValue}>{formatBs(totals.subtotal)}</span>
              </div>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>
                  IVA ({defaultIva}%)
                </span>
                <span className={styles.totalValue}>{formatBs(totals.iva)}</span>
              </div>
              <div className={`${styles.totalRow} ${styles.totalFinal}`}>
                <span>Total</span>
                <span>{formatBs(invoice.total)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar factura"
        message={
          <>
            ¿Eliminar la factura <strong>{invoice.number}</strong> de{' '}
            <strong>{invoice.client}</strong>?
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
