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
    // Validation du thème
    if (newTheme !== 'light' && newTheme !== 'dark') {
      console.error('Thème invalide: valeur non autorisée');
      return;
    }
    
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      set({ theme: newTheme });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du thème');
      // Tentative de récupération en cas d'erreur de sauvegarde
      try {
        // Vérifier si le stockage est disponible
        await AsyncStorage.getItem('test');
      } catch (storageError) {
        console.error('Stockage indisponible');
      }
    }
  },

  // Bascule entre thème clair et sombre avec validation
  toggleTheme: async () => {
    const currentTheme = get().theme;
    const newTheme: ThemeType = currentTheme === 'light' ? 'dark' : 'light';
    
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      set({ theme: newTheme });
    } catch (error) {
      console.error('Erreur lors du basculement de thème:', error);
      // Garder le thème actuel en cas d'erreur
    }
  },
}));