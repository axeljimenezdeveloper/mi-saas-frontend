import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, Sparkles } from 'lucide-react';
import { Button } from '../../../../components/common/actions/Button';
import { useCompanyStore } from '../../../../stores';
import styles from './NotFound.module.css';

export default function NotFound() {
  const navigate = useNavigate();
  const isConfigured = useCompanyStore((s) => s.isConfigured);

  const primaryLabel = isConfigured ? 'Ir al dashboard' : 'Continuar configuracion';
  const primaryRoute = isConfigured ? '/dashboard' : '/onboarding';
  const primaryIcon = isConfigured ? <Home size={14} /> : <Sparkles size={14} />;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.codeBlock}>
          <Search size={48} />
        </div>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Pagina no encontrada</h2>
        <p className={styles.description}>
          La pagina que estas buscando no existe o fue movida. Verifica la URL o
          regresa al dashboard.
        </p>
        <div className={styles.actions}>
          <Button
            variant="outline"
            leftIcon={<ArrowLeft size={14} />}
            onClick={() => navigate(-1)}
          >
            Volver atras
          </Button>
          <Button
            variant="primary"
            leftIcon={primaryIcon}
            onClick={() => navigate(primaryRoute)}
          >
            {primaryLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
