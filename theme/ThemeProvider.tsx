import { useAppTheme } from '@/hooks/useAppTheme';
import { useThemeStore } from '@/store/themeStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { PropsWithChildren, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';

export default function ThemeProvider({ children }: PropsWithChildren) {
    const systemColorScheme = useColorScheme();
    const { theme, setTheme } = useThemeStore();
    const appTheme = useAppTheme();

    useEffect(() => {
        // Initialize theme on mount
        const initTheme = async () => {
            const savedTheme = await AsyncStorage.getItem('userTheme');
            if (savedTheme) {
                setTheme(savedTheme as 'light' | 'dark');
            } else if (systemColorScheme) {
                setTheme(systemColorScheme);
            }
        };
        initTheme();
    }, []);

    // Paper theme configuration
    const paperTheme = theme === 'dark'
        ? {
            ...DefaultTheme,
            colors: {
                ...DefaultTheme.colors,
                primary: appTheme.accent,
                background: appTheme.background,
                surface: appTheme.surface,
                text: appTheme.text,
                onSurface: appTheme.text,
                onSurfaceVariant: appTheme.textSecondary,
            },
            dark: true,
        }
        : {
            ...DefaultTheme,
            colors: {
                ...DefaultTheme.colors,
                primary: appTheme.accent,
                background: appTheme.background,
                surface: appTheme.surface,
                text: appTheme.text,
                onSurface: appTheme.text,
                onSurfaceVariant: appTheme.textSecondary,
            },
            dark: false,
        };

    // Navigation theme configuration
    const navigationTheme = theme === 'dark'
        ? {
            ...DarkTheme,
            colors: {
                ...DarkTheme.colors,
                background: appTheme.background,
                text: appTheme.text,
                border: appTheme.border,
                card: appTheme.card,
                primary: appTheme.accent,
            },
        }
        : {
            ...DefaultTheme,
            colors: {
                ...DefaultTheme.colors,
                background: appTheme.background,
                text: appTheme.text,
                border: appTheme.border,
                card: appTheme.card,
                primary: appTheme.accent,
            },
        };

    return (
        <PaperProvider theme={paperTheme}>
            <NavigationThemeProvider value={navigationTheme}>
                {children}
            </NavigationThemeProvider>
        </PaperProvider>
    );
}