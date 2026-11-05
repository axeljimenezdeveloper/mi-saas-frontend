import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Receipt,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Plus,
  ShoppingCart,
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
import {
  useProductsStore,
  useInvoicesStore,
  useAuthStore,
} from '../../../../stores';
import styles from './Dashboard.module.css';

const formatBs = (amount: number): string =>
  new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

const formatDate = (iso: string): string => {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const products = useProductsStore((s) => s.products);
  const invoices = useInvoicesStore((s) => s.invoices);

  const metrics = useMemo(() => {
    const activeProducts = products.filter((p) => p.status === 'in-stock').length;
    const lowStockProducts = products.filter((p) => p.status === 'low-stock').length;
    const outOfStockProducts = products.filter((p) => p.status === 'out-of-stock').length;

    const paidInvoices = invoices.filter((i) => i.status === 'paid');
    const pendingInvoices = invoices.filter((i) => i.status === 'pending');
    const overdueInvoices = invoices.filter((i) => i.status === 'overdue');

    const totalRevenue = paidInvoices.reduce((acc, i) => acc + i.total, 0);

    return {
      activeProducts,
      lowStockProducts,
      outOfStockProducts,
      paidInvoices: paidInvoices.length,
      pendingInvoices: pendingInvoices.length,
      overdueInvoices: overdueInvoices.length,
      totalRevenue,
      totalProducts: products.length,
      totalInvoices: invoices.length,
    };
  }, [products, invoices]);

  // Datos para el grafico: ventas por dia (ultimos 7 dias)
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
        .slice(0, 5),
    [products]
  );

  const recentInvoices = useMemo(() => invoices.slice(0, 5), [invoices]);

  const hasData = products.length > 0 || invoices.length > 0;

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>
              {user?.name ? `Hola, ${user.name.split(' ')[0]}` : 'Resumen general de tu negocio'}
            </p>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        {!hasData ? (
          <div className={styles.emptyWrapper}>
            <EmptyState
              title="Tu negocio esta vacio"
              description="Comienza agregando tu primer producto para empezar a ver metricas, graficos y actividad."
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
        ) : (
          <>
            {/* ============ STATS ============ */}
            <div className={styles.statsGrid}>
              <Card padding="md">
                <div className={styles.stat}>
                  <div className={`${styles.iconWrapper} ${styles.primary}`}>
                    <Package size={22} />
                  </div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Productos</p>
                    <p className={styles.statValue}>{metrics.totalProducts}</p>
                    <div className={styles.statBreakdown}>
                      <span className={styles.dotSuccess} />
                      {metrics.activeProducts} activos ·{' '}
                      <span className={styles.dotWarning} />
                      {metrics.lowStockProducts} bajos ·{' '}
                      <span className={styles.dotDanger} />
                      {metrics.outOfStockProducts} agotados
                    </div>
                  </div>
                </div>
              </Card>

              <Card padding="md">
                <div className={styles.stat}>
                  <div className={`${styles.iconWrapper} ${styles.success}`}>
                    <Receipt size={22} />
                  </div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Facturas</p>
                    <p className={styles.statValue}>{metrics.totalInvoices}</p>
                    <div className={styles.statBreakdown}>
                      <span className={styles.dotSuccess} />
                      {metrics.paidInvoices} pagadas ·{' '}
                      <span className={styles.dotWarning} />
                      {metrics.pendingInvoices} pendientes ·{' '}
                      <span className={styles.dotDanger} />
                      {metrics.overdueInvoices} vencidas
                    </div>
                  </div>
                </div>
              </Card>

              <Card padding="md">
                <div className={styles.stat}>
                  <div className={`${styles.iconWrapper} ${styles.info}`}>
                    <TrendingUp size={22} />
                  </div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Ventas cobradas</p>
                    <p className={styles.statValue}>{formatBs(metrics.totalRevenue)}</p>
                    <div className={styles.statBreakdown}>
                      De facturas pagadas
                    </div>
                  </div>
                </div>
              </Card>

              <Card padding="md">
                <div className={styles.stat}>
                  <div className={`${styles.iconWrapper} ${styles.warning}`}>
                    <AlertTriangle size={22} />
                  </div>
                  <div className={styles.statContent}>
                    <p className={styles.statLabel}>Alertas de stock</p>
                    <p className={styles.statValue}>
                      {metrics.lowStockProducts + metrics.outOfStockProducts}
                    </p>
                    <div className={styles.statBreakdown}>
                      Productos requieren atencion
                    </div>
                  </div>
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
                      tickFormatter={(v) => `Bs. ${v}`}
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
                  <Button
                    variant="ghost"
                    size="sm"
                    rightIcon={<ArrowRight size={14} />}
                    onClick={() => navigate('/products')}
                  >
                    Ver todos
                  </Button>
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
                      Ultimas 5 facturas emitidas
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    rightIcon={<ArrowRight size={14} />}
                    onClick={() => navigate('/billing')}
                  >
                    Ver todas
                  </Button>
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
                              {inv.client} · {formatDate(inv.date)}
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
