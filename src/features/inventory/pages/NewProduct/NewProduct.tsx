import { useState } from 'react';
import { Package, Tag, DollarSign, Boxes, FolderTree, Save, X } from 'lucide-react';
import { Input } from '../../../../components/common/inputs/Input';
import { Textarea } from '../../../../components/common/inputs/Textarea';
import { Select } from '../../../../components/common/inputs/Select';
import { Button } from '../../../../components/common/actions/Button';
import styles from './NewProduct.module.css';

interface FormState {
  name: string;
  sku: string;
  category: string;
  price: string;
  stock: string;
  description: string;
}

interface FormErrors {
  name?: string;
  category?: string;
  price?: string;
  stock?: string;
}

const CATEGORY_OPTIONS = [
  { value: 'electronics', label: 'Electrónica' },
  { value: 'clothing', label: 'Ropa y accesorios' },
  { value: 'food', label: 'Alimentos y bebidas' },
  { value: 'home', label: 'Hogar' },
  { value: 'beauty', label: 'Belleza y cuidado personal' },
  { value: 'other', label: 'Otros' },
];

const INITIAL_FORM: FormState = {
  name: '',
  sku: '',
  category: '',
  price: '',
  stock: '',
  description: '',
};

export default function NewProduct() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = 'El nombre del producto es obligatorio';
    if (!form.category.trim()) next.category = 'Debes seleccionar una categoría';
    if (!form.price.trim()) next.price = 'El precio unitario es obligatorio';
    else if (Number(form.price) <= 0) next.price = 'El precio debe ser mayor a cero';
    if (!form.stock.trim()) next.stock = 'El stock inicial es obligatorio';
    else if (Number(form.stock) < 0) next.stock = 'El stock no puede ser negativo';
    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setForm(INITIAL_FORM);
      alert('Producto creado correctamente (demo)');
    }, 1500);
  };

  const handleCancel = () => {
    setForm(INITIAL_FORM);
    setErrors({});
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.section}>
        <div>
          <h2 className={styles.sectionTitle}>Informacion del producto</h2>
        </div>

        <div className={styles.grid}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="product-name">
              Nombre del producto
            </label>
            <Input
              id="product-name"
              placeholder="Ej. Camisa azul talla M"
              leftIcon={<Package size={16} />}
              value={form.name}
              onChange={handleChange('name')}
              error={errors.name}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="product-sku">
              SKU / Codigo <span className={styles.optional}>(opcional)</span>
            </label>
            <Input
              id="product-sku"
              placeholder="Ej. CAM-AZ-M-001"
              leftIcon={<Tag size={16} />}
              value={form.sku}
              onChange={handleChange('sku')}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="product-category">
              Categoria
            </label>
            <Select
              id="product-category"
              placeholder="Selecciona una categoria"
              leftIcon={<FolderTree size={16} />}
              options={CATEGORY_OPTIONS}
              value={form.category}
              onChange={handleChange('category')}
              error={errors.category}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="product-price">
              Precio unitario (Bs.)
            </label>
            <Input
              id="product-price"
              type="number"
              placeholder="0.00"
              leftIcon={<DollarSign size={16} />}
              value={form.price}
              onChange={handleChange('price')}
              error={errors.price}
              min="0"
              step="0.01"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="product-stock">
              Stock inicial
            </label>
            <Input
              id="product-stock"
              type="number"
              placeholder="0"
              leftIcon={<Boxes size={16} />}
              value={form.stock}
              onChange={handleChange('stock')}
              error={errors.stock}
              min="0"
            />
          </div>

          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label className={styles.label} htmlFor="product-description">
              Descripcion <span className={styles.optional}>(opcional)</span>
            </label>
            <Textarea
              id="product-description"
              placeholder="Describe el producto, materiales, caracteristicas..."
              value={form.description}
              onChange={handleChange('description')}
              helperText="Maximo 500 caracteres"
              rows={4}
            />
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
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
