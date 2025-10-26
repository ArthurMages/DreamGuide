import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { useThemeStore } from '../store/themeStore';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const appTheme = useAppTheme();

  const icon = theme === 'dark' ? '☀️' : '🌙';
  const buttonColor = theme === 'light' ? '#FFFFFF' : '#000000';
  const iconColor = theme === 'light' ? '#000000' : '#FFFFFF';

  return (
    <Pressable
      style={[styles.button, { backgroundColor: buttonColor }]}
      onPress={toggleTheme}
      accessibilityLabel={`Basculer vers le thème ${theme === 'dark' ? 'clair' : 'sombre'}`}
      accessibilityRole="button"
    >
      <Text style={[styles.icon, { color: iconColor }]}>
        {icon}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 22,
  },
});