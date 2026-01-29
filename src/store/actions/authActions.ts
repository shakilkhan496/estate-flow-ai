import { AppDispatch } from '../index';
import { setUser, clearUser, setLoading, setError, User } from '../slices/authSlice';

export const fetchCurrentUser = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch('/api/auth/me');
    if (response.ok) {
      const data = await response.json();
      dispatch(setUser({
        id: data.user.userId,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
      }));
    } else {
      dispatch(clearUser());
    }
  } catch {
    dispatch(clearUser());
  }
};

export const loginUser = (email: string, password: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      dispatch(setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
      }));
      return { success: true };
    } else {
      dispatch(setError(data.error || 'Login failed'));
      return { success: false, error: data.error };
    }
  } catch {
    dispatch(setError('Network error'));
    return { success: false, error: 'Network error' };
  }
};

export const registerUser = (name: string, email: string, password: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      dispatch(setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
      }));
      return { success: true };
    } else {
      dispatch(setError(data.error || 'Registration failed'));
      return { success: false, error: data.error };
    }
  } catch {
    dispatch(setError('Network error'));
    return { success: false, error: 'Network error' };
  }
};

export const logoutUser = () => async (dispatch: AppDispatch) => {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
    dispatch(clearUser());
    return { success: true };
  } catch {
    dispatch(clearUser());
    return { success: true };
  }
};
