import { forwardRef, useRef, useState } from 'react';
import { ImagePlus, X, Upload, AlertCircle } from 'lucide-react';
import styles from './ImageUploader.module.css';

export interface ImageUploaderProps {
  /** Array de imagenes en base64 (data URL). */
  value?: string[];
  /** Callback al cambiar la lista de imagenes. */
  onChange: (images: string[]) => void;
  /** Mensaje de error externo (por ejemplo, de Zod). */
  error?: string;
  /** Texto de ayuda debajo del dropzone. */
  helperText?: string;
  /** Maximo de imagenes permitidas. */
  maxImages?: number;
  /** Tamano maximo por archivo en MB. */
  maxSizeMB?: number;
  /** Tipos MIME aceptados. */
  accept?: string;
  /** Deshabilita la interaccion. */
  disabled?: boolean;
}

const DEFAULT_MAX_IMAGES = 5;
const DEFAULT_MAX_SIZE_MB = 5;
const DEFAULT_ACCEPT = 'image/png,image/jpeg,image/webp,image/gif';

/**
 * Lee un File como data URL (base64).
 */
function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export const ImageUploader = forwardRef<HTMLDivElement, ImageUploaderProps>(
  (
    {
      value = [],
      onChange,
      error,
      helperText,
      maxImages = DEFAULT_MAX_IMAGES,
      maxSizeMB = DEFAULT_MAX_SIZE_MB,
      accept = DEFAULT_ACCEPT,
      disabled = false,
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const remainingSlots = maxImages - value.length;
    const isFull = remainingSlots <= 0;
    const errorToShow = localError ?? error;

    const processFiles = async (files: FileList | File[]) => {
      setLocalError(null);

      const fileArray = Array.from(files);

      if (fileArray.length > remainingSlots) {
        setLocalError(
          `Solo puedes subir ${remainingSlots} imagen${
            remainingSlots === 1 ? '' : 'es'
          } mas (maximo ${maxImages}).`
        );
        return;
      }

      const maxBytes = maxSizeMB * 1024 * 1024;
      const oversized = fileArray.filter((f) => f.size > maxBytes);
      if (oversized.length > 0) {
        setLocalError(
          `Cada imagen debe pesar menos de ${maxSizeMB} MB.`
        );
        return;
      }

      const invalidType = fileArray.filter((f) => !f.type.startsWith('image/'));
      if (invalidType.length > 0) {
        setLocalError('Solo se permiten archivos de imagen.');
        return;
      }

      setIsProcessing(true);
      try {
        const dataUrls = await Promise.all(fileArray.map(readFileAsDataURL));
        onChange([...value, ...dataUrls]);
      } catch {
        setLocalError('No se pudieron cargar las imagenes. Intenta de nuevo.');
      } finally {
        setIsProcessing(false);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        void processFiles(e.target.files);
      }
      // Reset para permitir subir el mismo archivo dos veces
      e.target.value = '';
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      if (disabled || isFull) return;
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled || isFull) return;
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        void processFiles(e.dataTransfer.files);
      }
    };

    const handleRemove = (index: number) => {
      if (disabled) return;
      setLocalError(null);
      onChange(value.filter((_, i) => i !== index));
    };

    const handleClickDropzone = () => {
      if (disabled || isFull || isProcessing) return;
      inputRef.current?.click();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClickDropzone();
      }
    };

    const dropzoneClasses = [
      styles.dropzone,
      isDragging && styles.dragging,
      errorToShow && styles.hasError,
      disabled && styles.disabled,
      isFull && styles.full,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={styles.container} ref={ref}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          className={styles.fileInput}
          onChange={handleInputChange}
          disabled={disabled || isFull}
          aria-label="Subir imagenes del producto"
        />

        <div
          className={dropzoneClasses}
          onClick={handleClickDropzone}
          onKeyDown={handleKeyDown}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={disabled || isFull ? -1 : 0}
          aria-disabled={disabled || isFull}
          aria-label="Zona para subir imagenes"
        >
          <div className={styles.dropzoneContent}>
            {isProcessing ? (
              <>
                <Upload size={24} className={styles.icon} />
                <p className={styles.dropzoneTitle}>Procesando imagenes...</p>
              </>
            ) : isFull ? (
              <>
                <ImagePlus size={24} className={styles.icon} />
                <p className={styles.dropzoneTitle}>Limite alcanzado</p>
                <p className={styles.dropzoneHint}>
                  Elimina una imagen para subir otra
                </p>
              </>
            ) : (
              <>
                <Upload size={24} className={styles.icon} />
                <p className={styles.dropzoneTitle}>
                  {isDragging
                    ? 'Suelta las imagenes aqui'
                    : 'Arrastra imagenes o haz click para subir'}
                </p>
                <p className={styles.dropzoneHint}>
                  PNG, JPG, WEBP o GIF · Max {maxSizeMB} MB c/u
                </p>
              </>
            )}
          </div>
        </div>

        {value.length > 0 && (
          <>
            <div className={styles.previewsHeader}>
              <span className={styles.previewsCount}>
                {value.length} de {maxImages} imagen
                {value.length === 1 ? '' : 'es'}
              </span>
            </div>
            <div className={styles.previews}>
              {value.map((src, index) => (
                <div key={`${src.slice(0, 32)}-${index}`} className={styles.preview}>
                  <img src={src} alt={`Imagen ${index + 1}`} className={styles.previewImage} />
                  {!disabled && (
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(index);
                      }}
                      aria-label={`Eliminar imagen ${index + 1}`}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {errorToShow && (
          <span className={styles.errorMessage} role="alert">
            <AlertCircle size={14} />
            {errorToShow}
          </span>
        )}
        {!errorToShow && helperText && (
          <span className={styles.helper}>{helperText}</span>
        )}
      </div>
    );
  }
);

ImageUploader.displayName = 'ImageUploader';
