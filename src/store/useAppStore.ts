import { create } from 'zustand';
import { UIState, createUISlice } from './slices/uiSlice';
import { DataState, createDataSlice } from './slices/dataSlice';
import { ToastState, createToastSlice } from './slices/toastSlice';

type StoreState = UIState & DataState & ToastState;

export const useAppStore = create<StoreState>()((...a) => ({
  ...createUISlice(...a),
  ...createDataSlice(...a),
  ...createToastSlice(...a),
}));
