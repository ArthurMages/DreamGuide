import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useThemeStore } from '../store/themeStore';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';
  const icon = isDark ? '☀️' : '🌙';
  const buttonColor = isDark ? '#000000' : '#FFFFFF';
  const iconColor = isDark ? '#FFFFFF' : '#000000';

  return (
    <Pressable
      style={[styles.button, { backgroundColor: buttonColor }]}
      onPress={toggleTheme}
      accessibilityLabel={`Basculer vers le thème ${isDark ? 'clair' : 'sombre'}`}
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