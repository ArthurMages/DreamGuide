import { createNavigationTheme, createPaperTheme } from '@/theme/theme';
import { useThemeStore } from '@/theme/themeStore';
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { PropsWithChildren, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';

export default function ThemeProvider({ children }: PropsWithChildren) {
    const systemColorScheme = useColorScheme();
    const { theme, init, setThemeType } = useThemeStore();

    useEffect(() => {
        // Initialize theme
        init();

        // Sync with system theme if needed
        const syncWithSystem = async () => {
            if (systemColorScheme) {
                await setThemeType(systemColorScheme);
            }
        };
        syncWithSystem();
    }, [systemColorScheme]);

    // Create themes for both providers
    const navigationTheme = createNavigationTheme(theme);
    const paperTheme = createPaperTheme(theme);

    return (
        <PaperProvider theme={paperTheme}>
            <NavigationThemeProvider value={navigationTheme}>
                {children}
            </NavigationThemeProvider>
        </PaperProvider>
    );
}