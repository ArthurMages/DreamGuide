import Colors from '@/constants/Colors';
import { useThemeStore } from '@/store/themeStore';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

export default function ThemeToggle() {
    const { theme, setTheme } = useThemeStore();
    const currentTheme = Colors[theme ?? 'light'];

    const toggleColorScheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <Pressable
            style={[styles.button, { backgroundColor: currentTheme.background }]}
            onPress={toggleColorScheme}
        >
            <Ionicons
                name={theme === 'dark' ? 'sunny' : 'moon'}
                size={24}
                color={currentTheme.text}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 8,
        borderRadius: 20,
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1000,
    },
});