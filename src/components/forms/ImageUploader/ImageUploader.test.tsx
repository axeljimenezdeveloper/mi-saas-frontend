import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageUploader } from './ImageUploader';

const FAKE_DATA_URL = 'data:image/png;base64,FAKEDATA';

function makeImageFile(name = 'test.png'): File {
  return new File(['fake-image-content'], name, { type: 'image/png' });
}

describe('ImageUploader', () => {
  beforeEach(() => {
    class MockFileReader {
      result: string | null = null;
      error: Error | null = null;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      readAsDataURL(_file: File) {
        this.result = FAKE_DATA_URL;
        setTimeout(() => this.onload?.(), 0);
      }
    }
    vi.stubGlobal('FileReader', MockFileReader);
  });

  it('renders empty dropzone with default text', () => {
    render(<ImageUploader onChange={() => {}} />);
    expect(
      screen.getByText('Arrastra imagenes o haz click para subir')
    ).toBeInTheDocument();
    expect(screen.getByText(/Max 5 MB c\/u/)).toBeInTheDocument();
  });

  it('renders helper text when provided and no error', () => {
    render(
      <ImageUploader onChange={() => {}} helperText="Sube fotos del producto" />
    );
    expect(screen.getByText('Sube fotos del producto')).toBeInTheDocument();
  });

  it('renders error message and hides helper when error is provided', () => {
    render(
      <ImageUploader
        onChange={() => {}}
        error="Error de prueba"
        helperText="Helper"
      />
    );
    expect(screen.getByText('Error de prueba')).toBeInTheDocument();
    expect(screen.queryByText('Helper')).not.toBeInTheDocument();
  });

  it('shows "limite alcanzado" when maxImages is reached', () => {
    const images = ['data:image/png;base64,A', 'data:image/png;base64,B'];
    render(
      <ImageUploader
        value={images}
        onChange={() => {}}
        maxImages={2}
      />
    );
    expect(screen.getByText('Limite alcanzado')).toBeInTheDocument();
    expect(
      screen.getByText('Elimina una imagen para subir otra')
    ).toBeInTheDocument();
  });

  it('renders previews for each image', () => {
    const images = [
      'data:image/png;base64,AAA',
      'data:image/png;base64,BBB',
    ];
    render(<ImageUploader value={images} onChange={() => {}} />);
    expect(screen.getByAltText('Imagen 1')).toBeInTheDocument();
    expect(screen.getByAltText('Imagen 2')).toBeInTheDocument();
    expect(screen.getByText('2 de 5 imagenes')).toBeInTheDocument();
  });

  it('calls onChange with image removed when remove button is clicked', async () => {
    const handleChange = vi.fn();
    const images = [
      'data:image/png;base64,AAA',
      'data:image/png;base64,BBB',
    ];
    const user = userEvent.setup();
    render(<ImageUploader value={images} onChange={handleChange} />);

    await user.click(screen.getByLabelText('Eliminar imagen 1'));
    expect(handleChange).toHaveBeenCalledWith([images[1]]);
  });

  it('does not render remove buttons when disabled', () => {
    const images = ['data:image/png;base64,AAA'];
    render(<ImageUploader value={images} onChange={() => {}} disabled />);
    expect(
      screen.queryByLabelText('Eliminar imagen 1')
    ).not.toBeInTheDocument();
  });

  it('opens file picker when dropzone is clicked', async () => {
    const user = userEvent.setup();
    render(<ImageUploader onChange={() => {}} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, 'click');
    await user.click(screen.getByLabelText('Zona para subir imagenes'));
    expect(clickSpy).toHaveBeenCalled();
  });

  it('adds images when files are selected via input', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<ImageUploader onChange={handleChange} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = makeImageFile('photo.png');
    await user.upload(input, file);

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith([FAKE_DATA_URL]);
    });
  });

  it('shows error when uploading more than remaining slots', async () => {
    const handleChange = vi.fn();
    const images = ['data:image/png;base64,AAA'];
    const user = userEvent.setup();
    render(
      <ImageUploader value={images} onChange={handleChange} maxImages={2} />
    );

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const files = [makeImageFile('a.png'), makeImageFile('b.png')];
    await user.upload(input, files);

    expect(
      screen.getByText(/Solo puedes subir 1 imagen mas/i)
    ).toBeInTheDocument();
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('shows error when file is not an image', async () => {
    const handleChange = vi.fn();
    render(<ImageUploader onChange={handleChange} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['text'], 'file.txt', { type: 'text/plain' });

    // fireEvent.change bypasea el filtro "accept" de userEvent.upload
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(
        screen.getByText('Solo se permiten archivos de imagen.')
      ).toBeInTheDocument();
    });
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('applies dragging state on dragOver and removes on dragLeave', () => {
    const { container } = render(<ImageUploader onChange={() => {}} />);
    const dropzone = screen.getByLabelText('Zona para subir imagenes');

    expect(container.querySelector('[class*="dragging"]')).not.toBeInTheDocument();

    fireEvent.dragOver(dropzone);
    expect(container.querySelector('[class*="dragging"]')).toBeInTheDocument();

    fireEvent.dragLeave(dropzone);
    expect(container.querySelector('[class*="dragging"]')).not.toBeInTheDocument();
  });

  it('does not open file picker when disabled', async () => {
    const user = userEvent.setup();
    render(<ImageUploader onChange={() => {}} disabled />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, 'click');
    await user.click(screen.getByLabelText('Zona para subir imagenes'));
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('does not open file picker when full', async () => {
    const user = userEvent.setup();
    const images = ['data:image/png;base64,A', 'data:image/png;base64,B'];
    render(
      <ImageUploader value={images} onChange={() => {}} maxImages={2} />
    );
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, 'click');
    await user.click(screen.getByLabelText('Zona para subir imagenes'));
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('accepts custom maxImages prop', () => {
    const images = ['data:image/png;base64,A'];
    render(
      <ImageUploader value={images} onChange={() => {}} maxImages={3} />
    );
    expect(screen.getByText('1 de 3 imagen')).toBeInTheDocument();
  });
});
