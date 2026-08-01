import { StateCreator } from 'zustand';
import type { NavPage, User, Professional, Patient } from '@/types';

export interface DataState {
  currentPage: NavPage;
  setPage: (page: NavPage) => void;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
  selectedProfessional: Professional | null;
  setSelectedProfessional: (prof: Professional | null) => void;
  detailOrigin: 'usuarios' | 'pacientes';
  setDetailOrigin: (origin: 'usuarios' | 'pacientes') => void;
}

export const createDataSlice: StateCreator<DataState> = (set) => ({
  currentPage: 'dashboard',
  setPage: (page) => set({ currentPage: page }),
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
  selectedPatient: null,
  setSelectedPatient: (patient) => set({ selectedPatient: patient }),
  selectedProfessional: null,
  setSelectedProfessional: (prof) => set({ selectedProfessional: prof }),
  detailOrigin: 'usuarios',
  setDetailOrigin: (origin) => set({ detailOrigin: origin }),
});
