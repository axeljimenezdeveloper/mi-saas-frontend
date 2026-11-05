import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Package, Tag, Boxes, FolderTree, Save, X, ArrowLeft } from 'lucide-react';
import { FormField } from '../../../../components/forms/FormField';
import { FormGroup } from '../../../../components/forms/FormGroup';
import { Input } from '../../../../components/common/inputs/Input';
import { Textarea } from '../../../../components/common/inputs/Textarea';
import { Select } from '../../../../components/common/inputs/Select';
import { Checkbox } from '../../../../components/common/inputs/Checkbox';
import { Radio } from '../../../../components/common/inputs/Radio';
import { Switch } from '../../../../components/common/inputs/Switch';
import { Button } from '../../../../components/common/actions/Button';
import { EmptyState } from '../../../../components/feedback/states/EmptyState';
import { CurrencyInput } from '../../../../components/forms/CurrencyInput';
import { ImageUploader } from '../../../../components/forms/ImageUploader';
import { useToast } from '../../../../components/feedback/alerts/Toast';
import { productSchema, type ProductFormData } from '../../../../schemas';
import { useProductsStore } from '../../../../stores';
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
  images: [],
  active: true,
  taxable: true,
  featured: false,
};

export default function NewProduct() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

  const products = useProductsStore((s) => s.products);
  const addProduct = useProductsStore((s) => s.addProduct);
  const updateProduct = useProductsStore((s) => s.updateProduct);

  const isEditMode = !!id;
  const editingProduct = isEditMode
    ? products.find((p) => String(p.id) === id)
    : undefined;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
  });

  // Precarga en modo edicion
  useEffect(() => {
    if (!editingProduct) return;
    const categoryEntry = CATEGORY_OPTIONS.find(
      (o) => o.label === editingProduct.category
    );
    reset({
      name: editingProduct.name,
      sku: editingProduct.sku,
      category: (categoryEntry?.value ?? 'other') as ProductFormData['category'],
      type: 'physical',
      price: editingProduct.price,
      stock: String(editingProduct.stock),
      description: '',
      images: editingProduct.images ?? [],
      active: true,
      taxable: true,
      featured: false,
    });
  }, [editingProduct, reset]);

  const watchedType = useWatch({ control, name: 'type' });
  const isService = watchedType === 'service';

  const onSubmit = (data: ProductFormData) => {
    const categoryLabel =
      CATEGORY_OPTIONS.find((o) => o.value === data.category)?.label ??
      data.category;

    setTimeout(() => {
      if (isEditMode && editingProduct) {
        updateProduct(editingProduct.id, {
          name: data.name.trim(),
          sku: data.sku?.trim() ?? '',
          category: categoryLabel,
          price: data.price,
          stock: Number(data.stock) || 0,
          images: data.images,
        });
        toast.success('Producto actualizado', `${data.name.trim()} se actualizo correctamente`);
      } else {
        addProduct({
          name: data.name.trim(),
          sku: data.sku?.trim() ?? '',
          category: categoryLabel,
          price: data.price,
          stock: Number(data.stock) || 0,
          images: data.images,
        });
        toast.success('Producto creado', `${data.name.trim()} se agrego al inventario`);
      }
      navigate('/products');
    }, 600);
  };

  const onInvalid = () => {
    toast.error('No se pudo guardar el producto', 'Revisa los campos marcados');
  };

  // Modo edicion pero el producto no existe
  if (isEditMode && !editingProduct) {
    return (
      <div className={styles.page}>
        <header className={styles.pageHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <button
                type="button"
                className={styles.backButton}
                onClick={() => navigate('/products')}
                aria-label="Volver"
              >
                <ArrowLeft size={18} />
              </button>
              <div className={styles.titleBlock}>
                <h1 className={styles.title}>Producto no encontrado</h1>
                <p className={styles.subtitle}>
                  El producto que buscas no existe o fue eliminado
                </p>
              </div>
            </div>
          </div>
        </header>
        <div className={styles.content}>
          <div className={styles.emptyWrapper}>
            <EmptyState
              title="Producto no encontrado"
              description="Vuelve al inventario y verifica la lista de productos."
              icon={<Package size={32} />}
              action={
                <Button onClick={() => navigate('/products')}>
                  Volver al inventario
                </Button>
              }
            />
          </div>
        </div>
      </div>
    );
  }

  const pageTitle = isEditMode ? 'Editar producto' : 'Nuevo producto';
  const pageSubtitle = isEditMode
    ? 'Actualiza los datos del producto'
    : 'Agrega un producto al inventario de tu negocio';
  const submitLabel = isEditMode ? 'Guardar cambios' : 'Guardar producto';

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <button
              type="button"
              className={styles.backButton}
              onClick={() => navigate('/products')}
              aria-label="Volver"
              title="Volver a productos"
            >
              <ArrowLeft size={18} />
            </button>
            <div className={styles.titleBlock}>
              <h1 className={styles.title}>{pageTitle}</h1>
              <p className={styles.subtitle}>{pageSubtitle}</p>
            </div>
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
            title="Imagenes del producto"
            description="Sube hasta 5 fotos del producto (opcional)"
            layout="stack"
          >
            <Controller
              control={control}
              name="images"
              render={({ field }) => (
                <ImageUploader
                  value={field.value}
                  onChange={field.onChange}
                  helperText="PNG, JPG, WEBP o GIF · Max 5 MB c/u"
                />
              )}
            />
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
                    fullWidth
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
              disabled={!isValid || isSubmitting}
            >
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
