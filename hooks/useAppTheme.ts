import { useThemeStore } from '@/store/themeStore';

export interface ThemeColors {
    background: string;
    text: string;
    textSecondary: string;
    card: string;
    border: string;
    accent: string;
    surface: string;
}

export const useAppTheme = () => {
    const { theme } = useThemeStore();

    const colors: { light: ThemeColors; dark: ThemeColors } = {
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
    return colors[theme ?? 'light'];
};