import styles from './Avatar.module.css';

export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline';

export interface AvatarProps {
  /** URL de la imagen. Si no se pasa o falla, se muestran las iniciales. */
  src?: string;
  /** Nombre completo (obligatorio para iniciales y aria-label). */
  name: string;
  /** Tamaño del avatar. */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Estado del usuario (dot de color en la esquina). */
  status?: AvatarStatus;
  /** Clase adicional. */
  className?: string;
}

/** Extrae hasta 2 iniciales del nombre. */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  src,
  name,
  size = 'md',
  status,
  className,
}: AvatarProps) {
  const classes = [styles.avatar, styles[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} role="img" aria-label={name}>
      {src ? (
        <img
          src={src}
          alt=""
          className={styles.image}
          onError={(e) => {
            // Si la imagen falla, oculta el img y deja las iniciales visibles
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <span className={styles.initials} aria-hidden="true">
          {getInitials(name)}
        </span>
      )}
      {status && (
        <span
          className={[styles.statusDot, styles[status]].join(' ')}
          aria-label={status}
        />
      )}
    </span>
  );
}
