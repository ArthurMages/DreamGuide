import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export type ThemeType = 'light' | 'dark';

export interface CustomThemeColors {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    accent: string;
    surface: string;
    surfaceVariant: string;
    onSurface: string;
    elevation: {
        level0: string;
        level1: string;
        level2: string;
    };
}

export interface Theme {
    dark: boolean;
    colors: CustomThemeColors;
}

const commonColors = {
    primary: '#6750A4',
    accent: '#7C4DFF',
};

export const lightTheme: Theme = {
    dark: false,
    colors: {
        ...commonColors,
        background: '#FFFFFF',
        card: '#FFFFFF',
        text: '#000000',
        border: '#E0E0E0',
        surface: '#FFFFFF',
        surfaceVariant: '#F5F5F5',
        onSurface: '#000000',
        elevation: {
            level0: '#FFFFFF',
            level1: '#F5F5F5',
            level2: '#EEEEEE',
        },
    },
};

export const darkTheme: Theme = {
    dark: true,
    colors: {
        ...commonColors,
        background: '#121212',
        card: '#1E1E1E',
        text: '#FFFFFF',
        border: '#2C2C2C',
        surface: '#1E1E1E',
        surfaceVariant: '#2C2C2C',
        onSurface: '#FFFFFF',
        elevation: {
            level0: '#121212',
            level1: '#1E1E1E',
            level2: '#222222',
        },
    },
};

// Création du thème pour React Navigation
export const createNavigationTheme = (theme: Theme) => ({
    ...theme.dark ? NavigationDarkTheme : NavigationDefaultTheme,
    colors: {
        ...theme.dark ? NavigationDarkTheme.colors : NavigationDefaultTheme.colors,
        primary: theme.colors.primary,
        background: theme.colors.background,
        card: theme.colors.card,
        text: theme.colors.text,
        border: theme.colors.border,
    },
});

// Création du thème pour React Native Paper
export const createPaperTheme = (theme: Theme) => ({
    ...(theme.dark ? MD3DarkTheme : MD3LightTheme),
    colors: {
        ...(theme.dark ? MD3DarkTheme.colors : MD3LightTheme.colors),
        primary: theme.colors.primary,
        background: theme.colors.background,
        surface: theme.colors.surface,
        surfaceVariant: theme.colors.surfaceVariant,
        onSurface: theme.colors.onSurface,
        elevation: theme.colors.elevation,
    },
});