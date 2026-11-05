import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders nothing when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        Contenido
      </Modal>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders dialog when isOpen is true', () => {
    render(
      <Modal isOpen onClose={() => {}}>
        Contenido del modal
      </Modal>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Contenido del modal')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <Modal isOpen onClose={() => {}} title="Titulo del modal">
        Body
      </Modal>
    );
    expect(
      screen.getByRole('heading', { name: 'Titulo del modal' })
    ).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    render(
      <Modal isOpen onClose={() => {}} footer={<button>Accion</button>}>
        Body
      </Modal>
    );
    expect(screen.getByRole('button', { name: 'Accion' })).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal isOpen onClose={onClose} title="Titulo">
        Body
      </Modal>
    );
    await user.click(screen.getByRole('button', { name: 'Cerrar modal' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      <Modal isOpen onClose={onClose}>
        Body
      </Modal>
    );
    const overlay = container.parentElement?.querySelector('[class*="overlay"]');
    if (overlay) await user.click(overlay as HTMLElement);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal isOpen onClose={onClose}>
        Body
      </Modal>
    );
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close on Escape when preventClose is true', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <Modal isOpen onClose={onClose} preventClose>
        Body
      </Modal>
    );
    await user.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not render close button when preventClose is true', () => {
    render(
      <Modal isOpen onClose={() => {}} title="Titulo" preventClose>
        Body
      </Modal>
    );
    expect(
      screen.queryByRole('button', { name: 'Cerrar modal' })
    ).not.toBeInTheDocument();
  });
});
