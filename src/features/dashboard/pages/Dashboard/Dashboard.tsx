import { Package, Receipt, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card } from '../../../../components/common/data-display/Card';
import { PageContainer } from '../../../../components/layout/PageContainer';
import { PageHeader } from '../../../../components/layout/PageHeader';
import styles from './Dashboard.module.css';

const STATS = [
  {
    label: 'Productos activos',
    value: '42',
    icon: <Package size={20} />,
    variant: 'primary' as const,
  },
  {
    label: 'Facturas del mes',
    value: '128',
    icon: <Receipt size={20} />,
    variant: 'success' as const,
  },
  {
    label: 'Alertas de stock',
    value: '3',
    icon: <AlertTriangle size={20} />,
    variant: 'warning' as const,
  },
  {
    label: 'Ventas del mes',
    value: 'Bs. 4.250,00',
    icon: <TrendingUp size={20} />,
    variant: 'info' as const,
  },
];

export default function Dashboard() {
  return (
    <PageContainer maxWidth="lg" padding="md">
      <PageHeader
        title="Dashboard"
        subtitle="Resumen general de tu negocio"
      />

      <div className={styles.grid}>
        {STATS.map((stat) => (
          <Card key={stat.label} padding="md">
            <div className={styles.stat}>
              <div className={`${styles.iconWrapper} ${styles[stat.variant]}`}>
                {stat.icon}
              </div>
              <div>
                <p className={styles.statLabel}>{stat.label}</p>
                <p className={styles.statValue}>{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
