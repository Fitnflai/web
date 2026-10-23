import { StateCreator } from 'zustand';

export interface UIState {
  isDarkMode: boolean;
  language: 'ES' | 'EN';
  userRole: 'admin' | 'specialist';
  toggleDarkMode: () => void;
  setLanguage: (lang: 'ES' | 'EN') => void;
  setUserRole: (role: 'admin' | 'specialist') => void;
}

const getInitialLanguage = (): 'ES' | 'EN' => {
  const saved = localStorage.getItem('fitnflai_language');
  return saved === 'EN' ? 'EN' : 'ES';
};

const getInitialTheme = (): boolean => {
  const saved = localStorage.getItem('fitnflai_theme');
  return saved !== 'false'; // defaults to true if not set
};

const getInitialUserRole = (): 'admin' | 'specialist' => {
  const saved = localStorage.getItem('fitnflai_user_role');
  return saved === 'specialist' ? 'specialist' : 'admin';
};

export const createUISlice: StateCreator<UIState> = (set) => ({
  isDarkMode: getInitialTheme(),
  language: getInitialLanguage(),
  userRole: getInitialUserRole(),
  toggleDarkMode: () => set((state) => {
    const nextMode = !state.isDarkMode;
    localStorage.setItem('fitnflai_theme', String(nextMode));
    return { isDarkMode: nextMode };
  }),
  setLanguage: (language) => set(() => {
    localStorage.setItem('fitnflai_language', language);
    return { language };
  }),
  setUserRole: (role) => set(() => {
    localStorage.setItem('fitnflai_user_role', role);
    return { userRole: role };
  }),
});
