import ThemeToggle from '@/components/ThemeToggle';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React from 'react';

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
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#fff',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#000',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          color: '#fff',
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#000',
          borderTopWidth: 0,
        },
        tabBarShowLabel: false,
      }}>
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