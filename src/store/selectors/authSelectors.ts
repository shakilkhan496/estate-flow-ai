import { RootState } from '../index';

export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectUserRole = (state: RootState) => state.auth.user?.role;

export const selectIsAdmin = (state: RootState) => state.auth.user?.role === 'admin';
export const selectIsManagerOrAbove = (state: RootState) => {
  const role = state.auth.user?.role;
  return role === 'admin' || role === 'manager';
};
export const selectIsBrokerOrAbove = (state: RootState) => {
  const role = state.auth.user?.role;
  return role === 'admin' || role === 'manager' || role === 'broker';
};
