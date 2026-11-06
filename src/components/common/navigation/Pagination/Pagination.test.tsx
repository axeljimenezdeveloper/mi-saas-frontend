import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('shows correct range text', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={() => {}}
        totalItems={45}
        itemsPerPage={10}
      />
    );
    expect(screen.getByText('Mostrando 11-20 de 45')).toBeInTheDocument();
  });

  it('shows "Sin resultados" when totalItems is 0', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={0}
        onPageChange={() => {}}
        totalItems={0}
        itemsPerPage={10}
      />
    );
    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
  });

  it('hides controls when totalPages <= 1', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
        totalItems={5}
        itemsPerPage={10}
      />
    );
    expect(screen.queryByLabelText('Pagina siguiente')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Pagina anterior')).not.toBeInTheDocument();
  });

  it('calls onPageChange when clicking next', async () => {
    const handlePageChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={handlePageChange}
        totalItems={45}
        itemsPerPage={10}
      />
    );
    await user.click(screen.getByLabelText('Pagina siguiente'));
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange when clicking previous', async () => {
    const handlePageChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={handlePageChange}
        totalItems={45}
        itemsPerPage={10}
      />
    );
    await user.click(screen.getByLabelText('Pagina anterior'));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('disables previous button on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={() => {}}
        totalItems={45}
        itemsPerPage={10}
      />
    );
    expect(screen.getByLabelText('Pagina anterior')).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={() => {}}
        totalItems={45}
        itemsPerPage={10}
      />
    );
    expect(screen.getByLabelText('Pagina siguiente')).toBeDisabled();
  });

  it('renders page number buttons', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={() => {}}
        totalItems={45}
        itemsPerPage={10}
      />
    );
    expect(screen.getByLabelText('Ir a pagina 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Ir a pagina 5')).toBeInTheDocument();
  });

  it('calls onPageChange when clicking a page number', async () => {
    const handlePageChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={handlePageChange}
        totalItems={45}
        itemsPerPage={10}
      />
    );
    await user.click(screen.getByLabelText('Ir a pagina 4'));
    expect(handlePageChange).toHaveBeenCalledWith(4);
  });

  it('shows ellipsis when there are many pages', () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={20}
        onPageChange={() => {}}
        totalItems={200}
        itemsPerPage={10}
      />
    );
    // Debe haber al menos 1 ellipsis (MoreHorizontal icon)
    const ellipsis = document.querySelectorAll('[class*="ellipsis"]');
    expect(ellipsis.length).toBeGreaterThan(0);
  });

  it('shows correct range for the last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={() => {}}
        totalItems={45}
        itemsPerPage={10}
      />
    );
    expect(screen.getByText('Mostrando 41-45 de 45')).toBeInTheDocument();
  });
});
