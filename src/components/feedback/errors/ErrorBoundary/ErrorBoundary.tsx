import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '../../../common/actions/Button';
import styles from './ErrorBoundary.module.css';

export interface ErrorBoundaryProps {
  children: ReactNode;
  /** Callback opcional cuando ocurre un error (para logging externo). */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Fallback custom. Si no se pasa, usa el default. */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // En produccion esto se enviaria a un servicio como Sentry
    console.error('[ErrorBoundary]', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/dashboard';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.page}>
          <div className={styles.card}>
            <div className={styles.iconWrapper}>
              <AlertTriangle size={32} />
            </div>
            <h1 className={styles.title}>Algo salio mal</h1>
            <p className={styles.description}>
              Ocurrio un error inesperado. Puedes recargar la pagina para
              intentarlo de nuevo, o volver al dashboard.
            </p>

            {this.state.error && (
              <details className={styles.details}>
                <summary className={styles.summary}>Detalles tecnicos</summary>
                <pre className={styles.pre}>{this.state.error.message}</pre>
              </details>
            )}

            <div className={styles.actions}>
              <Button
                variant="outline"
                leftIcon={<Home size={14} />}
                onClick={this.handleGoHome}
              >
                Ir al dashboard
              </Button>
              <Button
                variant="primary"
                leftIcon={<RefreshCw size={14} />}
                onClick={this.handleReload}
              >
                Recargar pagina
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

