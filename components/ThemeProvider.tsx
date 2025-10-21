import { useThemeStore } from '@/store/themeStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PropsWithChildren, useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

export default function ThemeProvider({ children }: PropsWithChildren) {
    const deviceTheme = useDeviceColorScheme();
    const { setTheme } = useThemeStore();

    useEffect(() => {
        const initTheme = async () => {
            const savedTheme = await AsyncStorage.getItem('userTheme');
            if (savedTheme) {
                setTheme(savedTheme as 'light' | 'dark');
            } else if (deviceTheme) {
                setTheme(deviceTheme);
            }
        };
        initTheme();
    }, []);

    return <>{children}</>;
}