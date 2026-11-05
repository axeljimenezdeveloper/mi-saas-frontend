import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmDialog } from './ConfirmDialog';

describe('ConfirmDialog', () => {
  it('renders nothing when isOpen is false', () => {
    render(
      <ConfirmDialog
        isOpen={false}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Eliminar producto"
        message="¿Estas seguro?"
      />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders title and message when isOpen is true', () => {
    render(
      <ConfirmDialog
        isOpen
        onClose={() => {}}
        onConfirm={() => {}}
        title="Eliminar producto"
        message="Esta accion no se puede deshacer"
      />
    );
    expect(screen.getByText('Eliminar producto')).toBeInTheDocument();
    expect(screen.getByText('Esta accion no se puede deshacer')).toBeInTheDocument();
  });

  it('renders default button labels', () => {
    render(
      <ConfirmDialog
        isOpen
        onClose={() => {}}
        onConfirm={() => {}}
        title="Confirmar"
        message="Mensaje"
      />
    );
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeInTheDocument();
  });

  it('renders custom button labels', () => {
    render(
      <ConfirmDialog
        isOpen
        onClose={() => {}}
        onConfirm={() => {}}
        title="Eliminar"
        message="Mensaje"
        confirmLabel="Si, eliminar"
        cancelLabel="No, volver"
      />
    );
    expect(screen.getByRole('button', { name: 'No, volver' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Si, eliminar' })).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(
      <ConfirmDialog
        isOpen
        onClose={() => {}}
        onConfirm={onConfirm}
        title="Confirmar"
        message="Mensaje"
      />
    );
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when cancel button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <ConfirmDialog
        isOpen
        onClose={onClose}
        onConfirm={() => {}}
        title="Confirmar"
        message="Mensaje"
      />
    );
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onConfirm when cancel is clicked', async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(
      <ConfirmDialog
        isOpen
        onClose={() => {}}
        onConfirm={onConfirm}
        title="Confirmar"
        message="Mensaje"
      />
    );
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('disables both buttons when isLoading is true', () => {
    render(
      <ConfirmDialog
        isOpen
        onClose={() => {}}
        onConfirm={() => {}}
        title="Confirmar"
        message="Mensaje"
        isLoading
      />
    );
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Confirmar' })).toBeDisabled();
  });

  it('uses primary variant styling when specified', () => {
    const { baseElement } = render(
      <ConfirmDialog
        isOpen
        onClose={() => {}}
        onConfirm={() => {}}
        title="Confirmar"
        message="Mensaje"
        variant="primary"
      />
    );
    // baseElement = document.body, que contiene el portal
    expect(baseElement.querySelector('[class*="primary"]')).toBeInTheDocument();
  });
});
