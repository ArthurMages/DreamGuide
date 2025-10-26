import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';

import ThemeToggle from '../../components/ThemeToggle';
import { useAppTheme } from '../../hooks/useAppTheme';

// Icône d'onglet avec état visuel focusé/non-focusé
interface TabBarIconProps {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  focused: boolean;
}

function TabBarIcon({ name, color, focused }: TabBarIconProps) {
  return (
    <FontAwesome
      name={name}
      size={focused ? 32 : 28}
      color={color}
      style={{
        marginBottom: -3,
        opacity: focused ? 1 : 0.7,
      }}
    />
  );
}

// Configuration principale des onglets avec thème adaptatif
export default function TabLayout() {
  const theme = useAppTheme();

  const screenOptions = {
    tabBarActiveTintColor: theme.text,
    tabBarInactiveTintColor: theme.text,
    headerShown: true,
    headerStyle: {
      backgroundColor: theme.background,
      elevation: 4,
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
    },
    headerTintColor: theme.text,
    headerTitleStyle: {
      color: theme.text,
      fontWeight: 'bold' as const,
      fontSize: 20,
      letterSpacing: 0.5,
    },
    tabBarStyle: {
      height: 60,
      paddingBottom: 8,
      paddingTop: 8,
      backgroundColor: theme.background,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    tabBarShowLabel: false,
  };

  return (
    <Tabs screenOptions={screenOptions}>
        <Tabs.Screen
          name="index"
          options={{
            title: '✨ Nouveau Rêve',
            headerTitle: '✨ Nouveau Rêve',
            headerRight: () => <ThemeToggle />,
            tabBarIcon: ({ color, focused }) => <TabBarIcon name="plus-circle" color={color} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="two"
          options={{
            title: '📖 Mes Rêves',
            headerTitle: '📖 Mes Rêves',
            headerRight: () => <ThemeToggle />,
            tabBarIcon: ({ color, focused }) => <TabBarIcon name="book" color={color} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="three"
          options={{
            title: '🔍 Rechercher',
            headerTitle: '🔍 Rechercher',
            headerRight: () => <ThemeToggle />,
            tabBarIcon: ({ color, focused }) => <TabBarIcon name="search" color={color} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: '📊 Statistiques',
            headerTitle: '📊 Statistiques',
            headerRight: () => <ThemeToggle />,
            tabBarIcon: ({ color, focused }) => <TabBarIcon name="bar-chart" color={color} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="export"
          options={{
            title: '📤 Exporter',
            headerTitle: '📤 Exporter',
            headerRight: () => <ThemeToggle />,
            tabBarIcon: ({ color, focused }) => <TabBarIcon name="share" color={color} focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: '🔔 Notifications',
            headerTitle: '🔔 Notifications',
            headerRight: () => <ThemeToggle />,
            tabBarIcon: ({ color, focused }) => <TabBarIcon name="cog" color={color} focused={focused} />,
          }}
        />
      </Tabs>
  );
}