import ThemeToggle from '@/components/ThemeToggle';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  focused: boolean;
}) {
  return (
    <FontAwesome
      size={props.focused ? 32 : 28}
      style={{
        marginBottom: -3,
        opacity: props.focused ? 1 : 0.7,
      }}
      {...props}
    />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#000',
        headerShown: true,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarShowLabel: false,
        headerRight: () => (
          <Pressable style={{ marginRight: 15 }}>
            <ThemeToggle />
          </Pressable>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Nouveau Rêve',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="plus-circle" color={color} focused={focused} />,

        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Mes Rêves',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="book" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="three"
        options={{
          title: 'Rechercher',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="search" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Statistiques',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="bar-chart" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="export"
        options={{
          title: 'Exporter',
          tabBarIcon: ({ color, focused }) => <TabBarIcon name="share" color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}