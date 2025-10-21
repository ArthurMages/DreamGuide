import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorSchemeName } from 'react-native';
import { create } from 'zustand';

interface ThemeState {
    theme: ColorSchemeName;
    setTheme: (theme: ColorSchemeName) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
    theme: 'light',
    setTheme: (theme) => {
        set({ theme });
        AsyncStorage.setItem('userTheme', theme || 'light');
    },
}));

// Initialiser le thème depuis le stockage
AsyncStorage.getItem('userTheme').then((theme) => {
    if (theme) {
        useThemeStore.getState().setTheme(theme as ColorSchemeName);
    }
});