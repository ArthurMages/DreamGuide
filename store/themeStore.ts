import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

type ThemeType = 'light' | 'dark';

interface ThemeState {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => Promise<void>;
    toggleTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
    theme: 'light',
    
    setTheme: async (newTheme) => {
        await AsyncStorage.setItem('userTheme', newTheme);
        set({ theme: newTheme });
    },
    
    toggleTheme: async () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        await AsyncStorage.setItem('userTheme', newTheme);
        set({ theme: newTheme });
    },
}));