import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAppTheme } from '../hooks/useAppTheme';
import { useThemeStore } from '../store/themeStore';

const ICON_SIZE = 24;

/**
 * Composant de basculement de thème
 * Affiche une icône soleil/lune et permet de basculer entre thème clair/sombre
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const appTheme = useAppTheme();

  const iconName = theme === 'dark' ? 'sunny' : 'moon';

  return (
    <Pressable
      style={styles.button}
      onPress={toggleTheme}
      accessibilityLabel={`Basculer vers le thème ${theme === 'dark' ? 'clair' : 'sombre'}`}
      accessibilityRole="button"
    >
      <Ionicons
        name={iconName}
        size={ICON_SIZE}
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