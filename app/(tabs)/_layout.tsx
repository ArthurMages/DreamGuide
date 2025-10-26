import React from 'react';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';

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
    },
    headerTintColor: theme.text,
    headerTitleStyle: {
      color: theme.text,
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
    <>
      <StatusBar style={theme.text === '#ffffff' ? 'light' : 'dark'} />
      <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Nouveau Rêve',
          headerTitle: 'Nouveau Rêve',
          headerRight: () => (
            <ThemeToggle />
          ),
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="plus-circle" color={color} focused={focused} />,

        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Mes Rêves',
          headerRight: () => (
            <ThemeToggle />
          ),
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="book" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: 'Rechercher',
          headerRight: () => (
            <ThemeToggle />
          ),
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="search" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Statistiques',
          headerRight: () => (
            <ThemeToggle />
          ),
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="bar-chart" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="export"
        options={{
          title: 'Exporter',
          headerRight: () => (
            <ThemeToggle />
          ),
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="share" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Notifications',
          headerRight: () => (
            <ThemeToggle />
          ),
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="bell" color={color} focused={focused} />,
        }}
      />
    </Tabs>
    </>
  );
}