import React, { PropsWithChildren, useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useThemeStore, type ThemeType } from '../store/themeStore';

const THEME_STORAGE_KEY = 'userTheme';

/**
 * Fournisseur de thème pour l'application
 * Initialise le thème au démarrage en fonction des préférences sauvegardées
 * ou du thème système de l'appareil
 */
export default function ThemeProvider({ children }: PropsWithChildren) {
  const deviceTheme = useDeviceColorScheme();
  const { setTheme } = useThemeStore();

  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
          setTheme(savedTheme as ThemeType);
        } else if (deviceTheme) {
          setTheme(deviceTheme as ThemeType);
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation du thème');
        // Fallback sécurisé sur le thème clair
        try {
          setTheme('light');
        } catch (fallbackError) {
          console.error('Erreur critique lors du fallback thème');
        }
      }
    };

    initializeTheme();
  }, [deviceTheme, setTheme]);

  return <>{children}</>;
}