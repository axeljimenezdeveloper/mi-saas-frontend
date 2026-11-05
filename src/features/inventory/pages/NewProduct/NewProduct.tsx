import { useNavigate } from 'react-router-dom';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Package, Tag, Boxes, FolderTree, Save, X } from 'lucide-react';
import { FormField } from '../../../../components/forms/FormField';
import { FormGroup } from '../../../../components/forms/FormGroup';
import { Input } from '../../../../components/common/inputs/Input';
import { Textarea } from '../../../../components/common/inputs/Textarea';
import { Select } from '../../../../components/common/inputs/Select';
import { Checkbox } from '../../../../components/common/inputs/Checkbox';
import { Radio } from '../../../../components/common/inputs/Radio';
import { Switch } from '../../../../components/common/inputs/Switch';
import { Badge } from '../../../../components/common/data-display/Badge';
import { Card } from '../../../../components/common/data-display/Card';
import { Button } from '../../../../components/common/actions/Button';
import { CurrencyInput } from '../../../../components/forms/CurrencyInput';
import { useToast } from '../../../../components/feedback/alerts/Toast';
import { productSchema, type ProductFormData } from '../../../../schemas';
import styles from './NewProduct.module.css';

const CATEGORY_OPTIONS = [
  { value: 'electronics', label: 'Electrónica' },
  { value: 'clothing', label: 'Ropa y accesorios' },
  { value: 'food', label: 'Alimentos y bebidas' },
  { value: 'home', label: 'Hogar' },
  { value: 'beauty', label: 'Belleza y cuidado personal' },
  { value: 'other', label: 'Otros' },
];

const PRODUCT_TYPE_OPTIONS: {
  value: ProductFormData['type'];
  label: string;
  helper: string;
}[] = [
  { value: 'physical', label: 'Físico', helper: 'Producto tangible con stock' },
  { value: 'digital', label: 'Digital', helper: 'Software, licencia o descarga' },
  { value: 'service', label: 'Servicio', helper: 'Trabajo o asesoría sin stock' },
];

const DEFAULT_VALUES: ProductFormData = {
  name: '',
  sku: '',
  category: 'other',
  type: 'physical',
  price: undefined as unknown as number,
  stock: '',
  description: '',
  active: true,
  taxable: true,
  featured: false,
};

export default function NewProduct() {
  const navigate = useNavigate();
  const toast = useToast();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onBlur',
  });

  const watchedActive = useWatch({ control, name: 'active' });
  const watchedType = useWatch({ control, name: 'type' });
  const isService = watchedType === 'service';

  const onSubmit = (data: ProductFormData) => {
    setTimeout(() => {
      toast.success(
        'Producto creado',
        `${data.name} se agrego correctamente al inventario`
      );
      reset(DEFAULT_VALUES);
      navigate('/products');
    }, 1200);
  };

  const onInvalid = () => {
    toast.error('No se pudo guardar el producto', 'Revisa los campos marcados');
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      noValidate
    >
      <Card
        header={
          <div className={styles.cardHeader}>
            <span className={styles.sectionTitle}>Nuevo producto</span>
            <div className={styles.sectionBadges}>
              <Badge variant="primary" size="sm">Nuevo</Badge>
              <Badge
                variant={watchedActive ? 'success' : 'neutral'}
                size="sm"
                withDot
              >
                {watchedActive ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
          </div>
        }
      >
        <div className={styles.sections}>
          <FormGroup
            title="Informacion del producto"
            description="Datos basicos para identificar el producto en el inventario"
            layout="two-columns"
          >
            <FormField label="Nombre del producto" htmlFor="product-name">
              <Input
                id="product-name"
                placeholder="Ej. Camisa azul talla M"
                leftIcon={<Package size={16} />}
                error={errors.name?.message}
                {...register('name')}
              />
            </FormField>

            <FormField label="SKU / Codigo" htmlFor="product-sku" optional>
              <Input
                id="product-sku"
                placeholder="Ej. CAM-AZ-M-001"
                leftIcon={<Tag size={16} />}
                {...register('sku')}
              />
            </FormField>

            <FormField label="Categoria" htmlFor="product-category">
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select
                    id="product-category"
                    placeholder="Selecciona una categoria"
                    leftIcon={<FolderTree size={16} />}
                    options={CATEGORY_OPTIONS}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    error={errors.category?.message}
                  />
                )}
              />
            </FormField>

            <FormField label="Precio unitario (Bs.)" htmlFor="product-price">
              <Controller
                control={control}
                name="price"
                render={({ field }) => (
                  <CurrencyInput
                    id="product-price"
                    value={field.value}
                    onChange={(v) => field.onChange(v)}
                    onBlur={field.onBlur}
                    error={errors.price?.message}
                  />
                )}
              />
            </FormField>

            <FormField label="Stock inicial" htmlFor="product-stock">
              <Input
                id="product-stock"
                type="number"
                placeholder={isService ? 'No aplica para servicios' : '0'}
                leftIcon={<Boxes size={16} />}
                disabled={isService}
                error={errors.stock?.message}
                {...register('stock')}
              />
            </FormField>
          </FormGroup>

          <FormGroup
            title="Configuracion"
            description="Tipo de producto, impuestos y visibilidad en el catalogo"
            layout="stack"
          >
            <div className={styles.field}>
              <label className={styles.label}>Tipo de producto</label>
              <div className={styles.radioGroup}>
                {PRODUCT_TYPE_OPTIONS.map((opt) => (
                  <Radio
                    key={opt.value}
                    id={`product-type-${opt.value}`}
                    value={opt.value}
                    label={opt.label}
                    helperText={opt.helper}
                    {...register('type')}
                  />
                ))}
              </div>
            </div>

            <FormField
              label="Descripcion"
              htmlFor="product-description"
              optional
              helperText="Maximo 500 caracteres"
            >
              <Textarea
                id="product-description"
                placeholder="Describe el producto, materiales, caracteristicas..."
                rows={4}
                {...register('description')}
              />
            </FormField>

            <div className={styles.checkboxGroup}>
              <Checkbox
                id="product-active"
                label="Producto activo"
                helperText="Visible en el catalogo y disponible para facturacion"
                {...register('active')}
              />
              <Checkbox
                id="product-taxable"
                label="Aplicar IVA (16%)"
                helperText="El precio incluye el impuesto al valor agregado"
                {...register('taxable')}
              />
              <Switch
                id="product-featured"
                label="Destacar en la tienda"
                helperText="Aparecera en la seccion de productos destacados"
                {...register('featured')}
              />
            </div>
          </FormGroup>
        </div>
      </Card>

      <div className={styles.footer}>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/products')}
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
          Guardar producto
        </Button>
      </div>
    </form>
  );
}


