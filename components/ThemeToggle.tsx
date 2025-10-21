import { useAppTheme } from '@/hooks/useAppTheme';
import { useThemeStore } from '@/store/themeStore';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

export default function ThemeToggle() {
    const { theme, setTheme } = useThemeStore();
    const appTheme = useAppTheme();

    const toggleColorScheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <Pressable
            style={styles.button}
            onPress={toggleColorScheme}
        >
            <Ionicons
                name={theme === 'dark' ? 'sunny' : 'moon'}
                size={24}
                color={appTheme.text}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 8,
        marginRight: 15,
    },
});