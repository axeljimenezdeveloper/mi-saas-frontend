import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore, selectIsAuthenticated } from './authStore';

describe('authStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ user: null, isLoading: false, error: null });
  });

  it('has default state: no user, no loading, no error', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('selectIsAuthenticated returns false when no user', () => {
    expect(selectIsAuthenticated(useAuthStore.getState())).toBe(false);
  });

  it('selectIsAuthenticated returns true when user exists', () => {
    useAuthStore.setState({
      user: { id: '1', name: 'Test', email: 'test@test.com', role: 'admin' },
    });
    expect(selectIsAuthenticated(useAuthStore.getState())).toBe(true);
  });

  it('login succeeds with valid credentials', async () => {
    const success = await useAuthStore
      .getState()
      .login('admin@vendra.com', 'admin123');
    expect(success).toBe(true);
    const state = useAuthStore.getState();
    expect(state.user).not.toBeNull();
    expect(state.user?.email).toBe('admin@vendra.com');
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('login sets loading to true during the request', async () => {
    const promise = useAuthStore
      .getState()
      .login('admin@vendra.com', 'admin123');
    // Justo despues de llamar, debe estar en loading
    expect(useAuthStore.getState().isLoading).toBe(true);
    await promise;
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it('login fails with invalid credentials', async () => {
    const success = await useAuthStore
      .getState()
      .login('wrong@email.com', 'wrongpass');
    expect(success).toBe(false);
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.error).toContain('Credenciales incorrectas');
  });

  it('logout clears the user and error', async () => {
    await useAuthStore.getState().login('admin@vendra.com', 'admin123');
    expect(useAuthStore.getState().user).not.toBeNull();

    useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.error).toBeNull();
  });

  it('clearError removes the error', async () => {
    await useAuthStore.getState().login('wrong@email.com', 'wrongpass');
    expect(useAuthStore.getState().error).not.toBeNull();

    useAuthStore.getState().clearError();
    expect(useAuthStore.getState().error).toBeNull();
  });

  it('persists user to localStorage (not isLoading/error)', async () => {
    await useAuthStore.getState().login('admin@vendra.com', 'admin123');

    const raw = localStorage.getItem('mi-saas-auth-user');
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(raw as string);
    expect(parsed.state.user).not.toBeNull();
    expect(parsed.state.user.email).toBe('admin@vendra.com');
    expect(parsed.state.isLoading).toBeUndefined();
    expect(parsed.state.error).toBeUndefined();
  });
});

