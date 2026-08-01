import { StateCreator } from 'zustand';
import { toast } from '@/components/ui/Toast';

export interface ToastState {
  toast: { message: string; visible: boolean };
  showToast: (message: string) => void;
  hideToast: () => void;
  openModal: string | null;
  setOpenModal: (id: string | null) => void;
}

export const createToastSlice: StateCreator<ToastState> = (set) => ({
  toast: { message: '', visible: false },
  showToast: (message) => {
    toast.show(message, 'success');
  },
  hideToast: () => {
    toast.hide();
  },
  openModal: null,
  setOpenModal: (id) => set({ openModal: id }),
});
