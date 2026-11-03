import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Table, type TableColumn } from './Table';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

const PRODUCTS: Product[] = [
  { id: 1, name: 'Camisa', price: 25, stock: 10 },
  { id: 2, name: 'Pantalon', price: 40, stock: 5 },
  { id: 3, name: 'Zapatos', price: 60, stock: 0 },
];

const COLUMNS: TableColumn<Product>[] = [
  { key: 'name', header: 'Producto' },
  { key: 'price', header: 'Precio', align: 'right' },
  { key: 'stock', header: 'Stock', align: 'center' },
];

describe('Table', () => {
  it('renders column headers', () => {
    render(
      <Table
        columns={COLUMNS}
        data={PRODUCTS}
        getRowKey={(p) => p.id}
      />
    );
    expect(screen.getByText('Producto')).toBeInTheDocument();
    expect(screen.getByText('Precio')).toBeInTheDocument();
    expect(screen.getByText('Stock')).toBeInTheDocument();
  });

  it('renders rows from data', () => {
    render(
      <Table
        columns={COLUMNS}
        data={PRODUCTS}
        getRowKey={(p) => p.id}
      />
    );
    expect(screen.getByText('Camisa')).toBeInTheDocument();
    expect(screen.getByText('Pantalon')).toBeInTheDocument();
    expect(screen.getByText('Zapatos')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
  });

  it('renders custom cell with render function', () => {
    const columnsWithRender: TableColumn<Product>[] = [
      ...COLUMNS,
      {
        key: 'actions',
        header: 'Acciones',
        render: (p) => <button>Editar {p.name}</button>,
      },
    ];
    render(
      <Table
        columns={columnsWithRender}
        data={PRODUCTS}
        getRowKey={(p) => p.id}
      />
    );
    expect(screen.getByRole('button', { name: 'Editar Camisa' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Editar Pantalon' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Editar Zapatos' })).toBeInTheDocument();
  });

  it('shows empty message when data is empty', () => {
    render(
      <Table
        columns={COLUMNS}
        data={[]}
        getRowKey={(p) => p.id}
        emptyMessage="No hay productos registrados"
      />
    );
    expect(screen.getByText('No hay productos registrados')).toBeInTheDocument();
  });

  it('shows default empty message when data is empty and no emptyMessage provided', () => {
    render(<Table columns={COLUMNS} data={[]} getRowKey={(p) => p.id} />);
    expect(screen.getByText('No hay datos para mostrar')).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    render(
      <Table
        columns={COLUMNS}
        data={PRODUCTS}
        getRowKey={(p) => p.id}
        isLoading
      />
    );
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
    expect(screen.queryByText('Camisa')).not.toBeInTheDocument();
  });

  it('calls onRowClick when a row is clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Table
        columns={COLUMNS}
        data={PRODUCTS}
        getRowKey={(p) => p.id}
        onRowClick={handleClick}
      />
    );
    await user.click(screen.getByText('Camisa'));
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(PRODUCTS[0]);
  });

  it('applies alignment to header and cells', () => {
    render(
      <Table
        columns={COLUMNS}
        data={PRODUCTS}
        getRowKey={(p) => p.id}
      />
    );
    const priceHeader = screen.getByText('Precio');
    expect(priceHeader.style.textAlign).toBe('right');
    const stockHeader = screen.getByText('Stock');
    expect(stockHeader.style.textAlign).toBe('center');
  });

  it('renders correct number of rows', () => {
    const { container } = render(
      <Table
        columns={COLUMNS}
        data={PRODUCTS}
        getRowKey={(p) => p.id}
      />
    );
    const tbodyRows = container.querySelectorAll('tbody tr');
    expect(tbodyRows).toHaveLength(PRODUCTS.length);
  });
});
