import { useThemeStore } from '@/store/themeStore';
import { PropsWithChildren } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

export default function ThemeProvider({ children }: PropsWithChildren) {
    const deviceTheme = useDeviceColorScheme();
    const { theme, setTheme } = useThemeStore();

    // Synchroniser avec le thème du système si aucun thème n'est défini
    if (!theme) {
        setTheme(deviceTheme || 'light');
    }

    return children;
}