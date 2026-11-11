import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Receipt,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Plus,
  ShoppingCart,
  PackagePlus,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '../../../../components/common/data-display/Card';
import { Badge } from '../../../../components/common/data-display/Badge';
import { Button } from '../../../../components/common/actions/Button';
import { EmptyState } from '../../../../components/feedback/states/EmptyState';
import { useToast } from '../../../../components/feedback/alerts/Toast';
import {
  useProductsStore,
  useInvoicesStore,
  useCompanyStore,
} from '../../../../stores';
import { Skeleton } from '../../../../components/feedback/loading/Skeleton';
import { generateSampleProducts } from '../../../../features/demo/sampleProducts';
import styles from './Dashboard.module.css';

const formatBs = (amount: number): string =>
  'Bs. ' +
  new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

const formatDate = (iso: string): string => {
  const [y, m, d] = iso.split('-');
  return d + '/' + m + '/' + y;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const companyName = useCompanyStore((s) => s.company.name);
  const currency = useCompanyStore((s) => s.preferences.currency);
  const products = useProductsStore((s) => s.products);
  const addProduct = useProductsStore((s) => s.addProduct);
  const invoices = useInvoicesStore((s) => s.invoices);
  const isProductsLoading = useProductsStore((s) => s.isLoading);
  const isInvoicesLoading = useInvoicesStore((s) => s.isLoading);

  const [isGenerating, setIsGenerating] = useState(false);

  const metrics = useMemo(() => {
    const activeProducts = products.filter((p) => p.status === 'in-stock').length;
    const lowStockProducts = products.filter((p) => p.status === 'low-stock').length;
    const outOfStockProducts = products.filter((p) => p.status === 'out-of-stock').length;

    const paidInvoices = invoices.filter((i) => i.status === 'paid');
    const pendingInvoices = invoices.filter((i) => i.status === 'pending');
    const overdueInvoices = invoices.filter((i) => i.status === 'overdue');

    const totalRevenue = paidInvoices.reduce((acc, i) => acc + i.total, 0);
    const totalPending = pendingInvoices.reduce((acc, i) => acc + i.total, 0);

    return {
      activeProducts,
      lowStockProducts,
      outOfStockProducts,
      paidInvoices: paidInvoices.length,
      pendingInvoices: pendingInvoices.length,
      overdueInvoices: overdueInvoices.length,
      totalRevenue,
      totalPending,
      totalProducts: products.length,
      totalInvoices: invoices.length,
    };
  }, [products, invoices]);

  const chartData = useMemo(() => {
    const today = new Date();
    const days: { label: string; revenue: number; date: string }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const iso = date.toISOString().slice(0, 10);
      const label = date.toLocaleDateString('es-VE', {
        day: '2-digit',
        month: 'short',
      });
      const revenue = invoices
        .filter((inv) => inv.date === iso && inv.status === 'paid')
        .reduce((acc, inv) => acc + inv.total, 0);
      days.push({ label, revenue, date: iso });
    }

    return days;
  }, [invoices]);

  const lowStockList = useMemo(
    () =>
      products
        .filter((p) => p.status !== 'in-stock')
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 3),
    [products]
  );

  const recentInvoices = useMemo(() => invoices.slice(0, 3), [invoices]);

  const hasData = products.length > 0 || invoices.length > 0;
  const isInitialLoading = (isProductsLoading || isInvoicesLoading) && !hasData;

  const greeting = companyName
    ? 'Hola, ' + companyName
    : 'Resumen general de tu negocio';

  const handleGenerateSamples = () => {
    setIsGenerating(true);
    const samples = generateSampleProducts(currency);
    samples.forEach((product) => addProduct(product));
    toast.success(
      '16 productos de ejemplo creados',
      'Explora el inventario, crea facturas y prueba las notificaciones',
      { category: 'inventory' }
    );
    setIsGenerating(false);
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle} title={companyName || undefined}>
              {greeting}
            </p>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        {isInitialLoading ? (
          <>
            <div className={styles.statsGrid}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="rectangular" height="140px" />
              ))}
            </div>
            <Skeleton variant="rectangular" height="320px" />
          </>
        ) : !hasData ? (
          <div className={styles.emptyWrapper}>
            <EmptyState
              title="Tu negocio esta vacio"
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
        ) : (
          <>

            {/* ============ STATS ============ */}
            <div className={styles.statsGrid}>
              {/* Productos */}
              <Card padding="md" className={styles.statCard}>
                <div className={styles.statTop}>
                  <div className={`${styles.statIcon} ${styles.iconPrimary}`}>
                    <Package size={22} />
                  </div>
                  <div className={styles.statInfo}>
                    <span className={styles.statLabel}>Productos</span>
                    <span className={styles.statValue}>{metrics.totalProducts}</span>
                  </div>
                </div>
                {metrics.totalProducts > 0 && (
                  <div className={styles.statBar}>
                    <span
                      className={styles.barSuccess}
                      style={{ flex: metrics.activeProducts }}
                    />
                    <span
                      className={styles.barWarning}
                      style={{ flex: metrics.lowStockProducts }}
                    />
                    <span
                      className={styles.barDanger}
                      style={{ flex: metrics.outOfStockProducts }}
                    />
                  </div>
                )}
                <div className={styles.statLegend}>
                  <span className={styles.legendItem}>
                    <span className={`${styles.dot} ${styles.dotSuccess}`} />
                    {metrics.activeProducts} activos
                  </span>
                  <span className={styles.legendItem}>
                    <span className={`${styles.dot} ${styles.dotWarning}`} />
                    {metrics.lowStockProducts} bajos
                  </span>
                  <span className={styles.legendItem}>
                    <span className={`${styles.dot} ${styles.dotDanger}`} />
                    {metrics.outOfStockProducts} agotados
                  </span>
                </div>
              </Card>

              {/* Facturas */}
              <Card padding="md" className={styles.statCard}>
                <div className={styles.statTop}>
                  <div className={`${styles.statIcon} ${styles.iconSuccess}`}>
                    <Receipt size={22} />
                  </div>
                  <div className={styles.statInfo}>
                    <span className={styles.statLabel}>Facturas</span>
                    <span className={styles.statValue}>{metrics.totalInvoices}</span>
                  </div>
                </div>
                {metrics.totalInvoices > 0 && (
                  <div className={styles.statBar}>
                    <span
                      className={styles.barSuccess}
                      style={{ flex: metrics.paidInvoices }}
                    />
                    <span
                      className={styles.barWarning}
                      style={{ flex: metrics.pendingInvoices }}
                    />
                    <span
                      className={styles.barDanger}
                      style={{ flex: metrics.overdueInvoices }}
                    />
                  </div>
                )}
                <div className={styles.statLegend}>
                  <span className={styles.legendItem}>
                    <span className={`${styles.dot} ${styles.dotSuccess}`} />
                    {metrics.paidInvoices} pagadas
                  </span>
                  <span className={styles.legendItem}>
                    <span className={`${styles.dot} ${styles.dotWarning}`} />
                    {metrics.pendingInvoices} pendientes
                  </span>
                  <span className={styles.legendItem}>
                    <span className={`${styles.dot} ${styles.dotDanger}`} />
                    {metrics.overdueInvoices} vencidas
                  </span>
                </div>
              </Card>

              {/* Ventas cobradas */}
              <Card padding="md" className={styles.statCard}>
                <div className={styles.statTop}>
                  <div className={`${styles.statIcon} ${styles.iconInfo}`}>
                    <TrendingUp size={22} />
                  </div>
                  <div className={styles.statInfo}>
                    <span className={styles.statLabel}>Ventas cobradas</span>
                    <span className={`${styles.statValue} ${styles.statValueCurrency}`}>
                      {formatBs(metrics.totalRevenue)}
                    </span>
                  </div>
                </div>
                {(metrics.totalRevenue > 0 || metrics.totalPending > 0) && (
                  <div className={styles.statBar}>
                    <span
                      className={styles.barSuccess}
                      style={{ flex: metrics.totalRevenue || 1 }}
                    />
                    <span
                      className={styles.barInfo}
                      style={{ flex: metrics.totalPending || 1 }}
                    />
                  </div>
                )}
                <div className={styles.statLegend}>
                  <span className={styles.legendItem}>
                    <span className={`${styles.dot} ${styles.dotSuccess}`} />
                    {metrics.paidInvoices} pagadas
                  </span>
                  <span className={styles.legendItem}>
                    <span className={`${styles.dot} ${styles.dotInfo}`} />
                    {formatBs(metrics.totalPending)} por cobrar
                  </span>
                </div>
              </Card>

              {/* Alertas */}
              <Card padding="md" className={styles.statCard}>
                <div className={styles.statTop}>
                  <div className={`${styles.statIcon} ${styles.iconWarning}`}>
                    <AlertTriangle size={22} />
                  </div>
                  <div className={styles.statInfo}>
                    <span className={styles.statLabel}>Alertas de stock</span>
                    <span className={styles.statValue}>
                      {metrics.lowStockProducts + metrics.outOfStockProducts}
                    </span>
                  </div>
                </div>
                {(metrics.lowStockProducts + metrics.outOfStockProducts) > 0 && (
                  <div className={styles.statBar}>
                    <span
                      className={styles.barWarning}
                      style={{ flex: metrics.lowStockProducts || 1 }}
                    />
                    <span
                      className={styles.barDanger}
                      style={{ flex: metrics.outOfStockProducts || 1 }}
                    />
                  </div>
                )}
                <div className={styles.statLegend}>
                  <span className={styles.legendItem}>
                    <span className={`${styles.dot} ${styles.dotWarning}`} />
                    {metrics.lowStockProducts} stock bajo
                  </span>
                  <span className={styles.legendItem}>
                    <span className={`${styles.dot} ${styles.dotDanger}`} />
                    {metrics.outOfStockProducts} agotados
                  </span>
                </div>
              </Card>
            </div>

            {/* ============ CHART ============ */}
            <Card padding="md">
              <div className={styles.chartHeader}>
                <div>
                  <h3 className={styles.sectionTitle}>Ventas de los ultimos 7 dias</h3>
                  <p className={styles.sectionSubtitle}>
                    Solo facturas pagadas
                  </p>
                </div>
              </div>
              <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                      axisLine={{ stroke: 'var(--color-border)' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => 'Bs. ' + v}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-surface-raised)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        fontSize: '13px',
                      }}
                      labelStyle={{ color: 'var(--color-text)' }}
                      formatter={(value) => [formatBs(Number(value)), 'Ventas']}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--color-primary)"
                      strokeWidth={2}
                      fill="url(#revenueGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* ============ WIDGETS ============ */}
            <div className={styles.widgetsGrid}>
              <Card padding="md">
                <div className={styles.widgetHeader}>
                  <div>
                    <h3 className={styles.sectionTitle}>Stock bajo</h3>
                    <p className={styles.sectionSubtitle}>
                      Productos que necesitan reposicion
                    </p>
                  </div>
                  {products.filter((p) => p.status !== 'in-stock').length > 3 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      rightIcon={<ArrowRight size={14} />}
                      onClick={() => navigate('/products')}
                    >
                      Ver todos
                    </Button>
                  )}
                </div>

                {lowStockList.length === 0 ? (
                  <div className={styles.widgetEmpty}>
                    <p>Todo tu inventario esta en buen estado</p>
                  </div>
                ) : (
                  <ul className={styles.list}>
                    {lowStockList.map((p) => (
                      <li key={p.id} className={styles.listItem}>
                        <div className={styles.listItemLeft}>
                          {p.images && p.images.length > 0 ? (
                            <img src={p.images[0]} alt="" className={styles.thumb} />
                          ) : (
                            <div className={styles.thumbPlaceholder}>
                              <Package size={16} />
                            </div>
                          )}
                          <div className={styles.listItemContent}>
                            <span className={styles.listItemTitle}>{p.name}</span>
                            <span className={styles.listItemSubtitle}>
                              Stock: {p.stock} unidades
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant={p.status === 'out-of-stock' ? 'danger' : 'warning'}
                          withDot
                          size="sm"
                        >
                          {p.status === 'out-of-stock' ? 'Agotado' : 'Stock bajo'}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>

              <Card padding="md">
                <div className={styles.widgetHeader}>
                  <div>
                    <h3 className={styles.sectionTitle}>Facturas recientes</h3>
                    <p className={styles.sectionSubtitle}>
                      Ultimas 3 facturas emitidas
                    </p>
                  </div>
                  {invoices.length > 3 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      rightIcon={<ArrowRight size={14} />}
                      onClick={() => navigate('/billing')}
                    >
                      Ver todas ({invoices.length})
                    </Button>
                  )}
                </div>

                {recentInvoices.length === 0 ? (
                  <div className={styles.widgetEmpty}>
                    <ShoppingCart size={20} />
                    <p>Aun no has emitido facturas</p>
                  </div>
                ) : (
                  <ul className={styles.list}>
                    {recentInvoices.map((inv) => (
                      <li key={inv.id} className={styles.listItem}>
                        <div className={styles.listItemLeft}>
                          <div className={styles.thumbPlaceholder}>
                            <Receipt size={16} />
                          </div>
                          <div className={styles.listItemContent}>
                            <span className={styles.listItemTitle}>{inv.number}</span>
                            <span className={styles.listItemSubtitle}>
                              {inv.client} - {formatDate(inv.date)}
                            </span>
                          </div>
                        </div>
                        <div className={styles.listItemRight}>
                          <span className={styles.amount}>{formatBs(inv.total)}</span>
                          <Badge
                            variant={
                              inv.status === 'paid'
                                ? 'success'
                                : inv.status === 'pending'
                                ? 'warning'
                                : 'danger'
                            }
                            size="sm"
                          >
                            {inv.status === 'paid'
                              ? 'Pagada'
                              : inv.status === 'pending'
                              ? 'Pendiente'
                              : 'Vencida'}
                          </Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
