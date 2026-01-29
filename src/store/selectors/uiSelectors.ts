import { RootState } from '../index';

export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen;
export const selectToasts = (state: RootState) => state.ui.toasts;
export const selectIsPageLoading = (state: RootState) => state.ui.isPageLoading;
