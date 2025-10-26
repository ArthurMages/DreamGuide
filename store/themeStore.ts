import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

/**
 * Types de thèmes disponibles dans l'application
 */
export type ThemeType = 'light' | 'dark';

/**
 * Clé de stockage pour la préférence de thème utilisateur
 */
const THEME_STORAGE_KEY = 'userTheme';

/**
 * Interface définissant l'état et les actions du store de thème
 */
interface ThemeState {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => Promise<void>;
  toggleTheme: () => Promise<void>;
}

/**
 * Store Zustand pour la gestion du thème de l'application
 * Gère la persistance des préférences utilisateur
 */
export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',

  // Définit le thème avec validation et sauvegarde sécurisée
  setTheme: async (newTheme: ThemeType) => {
    try {
      if (newTheme !== 'light' && newTheme !== 'dark') {
        throw new Error('Invalid theme value');
      }
      
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      set({ theme: newTheme });
    } catch {
      console.error('Theme update failed');
      throw new Error('Failed to update theme');
    }
  },

  // Bascule entre thème clair et sombre avec validation
  toggleTheme: async () => {
    const currentTheme = get().theme;
    const newTheme: ThemeType = currentTheme === 'light' ? 'dark' : 'light';
    
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      set({ theme: newTheme });
    } catch {
      console.error('Failed to toggle theme');
      throw new Error('Failed to toggle theme');
    }
  },
}));