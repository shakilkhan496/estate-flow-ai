import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface UiState {
  sidebarOpen: boolean;
  toasts: Toast[];
  isPageLoading: boolean;
}

const initialState: UiState = {
  sidebarOpen: true,
  toasts: [],
  isPageLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
      if (typeof window !== 'undefined') {
        localStorage.setItem('sidebarOpen', String(state.sidebarOpen));
      }
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('sidebarOpen', String(action.payload));
      }
    },
    initSidebarFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('sidebarOpen');
        if (stored !== null) {
          state.sidebarOpen = stored === 'true';
        }
      }
    },
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      state.toasts.push({
        ...action.payload,
        id: Date.now().toString(),
      });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.isPageLoading = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  initSidebarFromStorage,
  addToast,
  removeToast,
  clearToasts,
  setPageLoading,
} = uiSlice.actions;
export default uiSlice.reducer;
