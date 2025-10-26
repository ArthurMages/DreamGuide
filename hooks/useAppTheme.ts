import { useThemeStore } from '@/store/themeStore';

/**
 * Interface définissant les couleurs du thème de l'application
 */
export interface ThemeColors {
  background: string;
  text: string;
  textSecondary: string;
  card: string;
  border: string;
  accent: string;
  surface: string;
}

/**
 * Définition des palettes de couleurs pour les thèmes clair et sombre
 */
const THEME_COLORS: Record<'light' | 'dark', ThemeColors> = {
  light: {
    background: '#ffffff',
    text: '#000000',
    textSecondary: '#666666',
    card: '#ffffff',
    border: '#e0e0e0',
    accent: '#000000',
    surface: '#f5f5f5',
  },
  dark: {
    background: '#000000',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    card: '#1a1a1a',
    border: '#333333',
    accent: '#ffffff',
    surface: '#1a1a1a',
  },
};

/**
 * Hook personnalisé pour accéder aux couleurs du thème actuel
 * @returns Les couleurs correspondant au thème sélectionné
 */
export const useAppTheme = (): ThemeColors => {
  const { theme } = useThemeStore();
  return THEME_COLORS[theme ?? 'light'];
};