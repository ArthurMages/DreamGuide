import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { Theme, ThemeType, darkTheme, lightTheme } from './theme';

interface ThemeState {
    themeType: ThemeType;
    theme: Theme;
    setThemeType: (type: ThemeType) => Promise<void>;
    toggleTheme: () => Promise<void>;
    init: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
    themeType: 'light',
    theme: lightTheme,

    setThemeType: async (type: ThemeType) => {
        await AsyncStorage.setItem('theme', type);
        set({
            themeType: type,
            theme: type === 'dark' ? darkTheme : lightTheme
        });
    },

    toggleTheme: async () => {
        const newType = get().themeType === 'light' ? 'dark' : 'light';
        await get().setThemeType(newType);
    },

    init: async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('theme');
            if (savedTheme) {
                set({
                    themeType: savedTheme as ThemeType,
                    theme: savedTheme === 'dark' ? darkTheme : lightTheme
                });
            } else {
                await AsyncStorage.setItem('theme', 'light');
            }
        } catch (error) {
            console.error('Failed to load theme:', error);
        }
    },
}));