import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Plus,
  Trash2,
  Save,
  X,
  User,
  Package,
  ShoppingCart,
  Receipt,
  ArrowLeft,
} from 'lucide-react';
import { FormField } from '../../../../components/forms/FormField';
import { FormGroup } from '../../../../components/forms/FormGroup';
import { Input } from '../../../../components/common/inputs/Input';
import { Select } from '../../../../components/common/inputs/Select';
import { Button } from '../../../../components/common/actions/Button';
import { Card } from '../../../../components/common/data-display/Card';
import { useToast } from '../../../../components/feedback/alerts/Toast';
import {
  invoiceSchema,
  type InvoiceFormData,
  type LineItemData,
} from '../../../../schemas';
import styles from './BillingNew.module.css';

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
}

const AVAILABLE_PRODUCTS: Product[] = [
  { id: 1, name: 'Camisa azul talla M', sku: 'CAM-AZ-M-001', price: 25.0 },
  { id: 2, name: 'Pantalon negro talla 32', sku: 'PAN-NE-32-002', price: 40.0 },
  { id: 3, name: 'Zapatos deportivos', sku: 'ZAP-DEP-003', price: 60.0 },
  { id: 4, name: 'Gorra bordada', sku: 'GOR-BOR-004', price: 15.0 },
  { id: 5, name: 'Bufanda de lana', sku: 'BUF-LAN-005', price: 18.0 },
];

const IVA_RATE = 0.16;

const formatBs = (amount: number): string =>
  new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES',
    minimumFractionDigits: 2,
  }).format(amount);

const PRODUCT_OPTIONS = AVAILABLE_PRODUCTS.map((p) => ({
  value: String(p.id),
  label: `${p.name} - ${formatBs(p.price)}`,
}));

export default function BillingNew() {
  const navigate = useNavigate();
  const toast = useToast();

  const [items, setItems] = useState<LineItemData[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState('1');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: { client: '', items: [] },
    mode: 'onBlur',
  });

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const iva = subtotal * IVA_RATE;
    return { subtotal, iva, total: subtotal + iva };
  }, [items]);

  const quantityError = useMemo(() => {
    if (!quantity.trim()) return 'Requerido';
    const qty = Number(quantity);
    if (!Number.isInteger(qty)) return 'Debe ser entero';
    if (qty <= 0) return 'Debe ser mayor a 0';
    if (qty > 999) return 'Maximo 999';
    return undefined;
  }, [quantity]);

  const syncItemsToForm = (newItems: LineItemData[]) => {
    setItems(newItems);
    setValue('items', newItems, { shouldValidate: errors.items !== undefined });
  };

  const handleAddItem = () => {
    if (!selectedProductId || quantityError) return;
    const product = AVAILABLE_PRODUCTS.find(
      (p) => String(p.id) === selectedProductId
    );
    if (!product) return;

    const qty = Number(quantity);
    const existing = items.find((i) => i.productId === product.id);

    const next = existing
      ? items.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + qty }
            : i
        )
      : [
          ...items,
          {
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity: qty,
          },
        ];

    syncItemsToForm(next);
    setSelectedProductId('');
    setQuantity('1');
  };

  const handleRemoveItem = (productId: number) => {
    const next = items.filter((i) => i.productId !== productId);
    syncItemsToForm(next);
  };

  const onSubmit = () => {
    setTimeout(() => {
      toast.success(
        'Factura creada',
        `Factura generada por ${formatBs(totals.total)}`
      );
      navigate('/billing');
    }, 1200);
  };

  const onInvalid = () => {
    toast.error('No se pudo guardar la factura', 'Revisa los campos marcados');
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.headerContent}>
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
            <h1 className={styles.title}>Nueva factura</h1>
            <p className={styles.subtitle}>Crea una factura para un cliente</p>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          noValidate
        >
          <FormGroup
            title="Datos del cliente"
            description="Informacion basica para emitir la factura"
            layout="two-columns"
          >
            <FormField label="Cliente" htmlFor="invoice-client">
              <Input
                id="invoice-client"
                placeholder="Ej. Carlos Rodriguez"
                leftIcon={<User size={16} />}
                error={errors.client?.message}
                {...register('client')}
              />
            </FormField>

            <FormField label="Fecha de emision" htmlFor="invoice-date">
              <Input
                id="invoice-date"
                type="text"
                value={new Date().toLocaleDateString('es-VE')}
                readOnly
                disabled
              />
            </FormField>
          </FormGroup>

          <FormGroup
            title="Productos"
            description="Selecciona los productos y cantidades a facturar"
            layout="stack"
          >
            <div className={styles.addRow}>
              <div className={styles.productSelect}>
                <Select
                  options={PRODUCT_OPTIONS}
                  placeholder="Selecciona un producto"
                  leftIcon={<Package size={16} />}
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                />
              </div>
              <div className={styles.quantityInput}>
                <Input
                  type="number"
                  placeholder="Cant."
                  min="1"
                  max="999"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  error={quantity ? quantityError : undefined}
                  size="md"
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                leftIcon={<Plus size={14} />}
                onClick={handleAddItem}
                disabled={!selectedProductId || !!quantityError}
              >
                Agregar
              </Button>
            </div>

            {errors.items && (
              <span className={styles.itemsError}>{errors.items.message}</span>
            )}

            {items.length === 0 ? (
              <div className={styles.emptyItems}>
                <ShoppingCart size={32} />
                <p>No hay productos en la factura</p>
                <span>Selecciona un producto arriba y presiona "Agregar"</span>
              </div>
            ) : (
              <div className={styles.itemsList}>
                <div className={styles.itemsHeader}>
                  <span>Producto</span>
                  <span className={styles.right}>Precio</span>
                  <span className={styles.center}>Cant.</span>
                  <span className={styles.right}>Subtotal</span>
                  <span />
                </div>
                {items.map((item) => (
                  <div key={item.productId} className={styles.itemRow}>
                    <span className={styles.itemName}>{item.productName}</span>
                    <span className={styles.right}>{formatBs(item.price)}</span>
                    <span className={styles.center}>{item.quantity}</span>
                    <span className={styles.right}>
                      {formatBs(item.price * item.quantity)}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      iconOnly
                      aria-label={`Quitar ${item.productName}`}
                      onClick={() => handleRemoveItem(item.productId)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </FormGroup>

          <Card padding="md">
            <div className={styles.summary}>
              <div className={styles.summaryHeader}>
                <Receipt size={18} />
                <span>Resumen de la factura</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Subtotal</span>
                <span className={styles.summaryValue}>
                  {formatBs(totals.subtotal)}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>IVA (16%)</span>
                <span className={styles.summaryValue}>
                  {formatBs(totals.iva)}
                </span>
              </div>
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Total</span>
                <span>{formatBs(totals.total)}</span>
              </div>
            </div>
          </Card>

          <div className={styles.footer}>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/billing')}
              leftIcon={<X size={14} />}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<Save size={14} />}
              isLoading={isSubmitting}
            >
              Guardar factura
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

