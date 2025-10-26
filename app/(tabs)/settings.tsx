import React from 'react';
import { ScrollView } from 'react-native';

import NotificationSettings from '../../components/NotificationSettings';
import { ThemedScreen } from '../../components/ThemedScreen';

// Écran de configuration des notifications
export default function SettingsScreen() {
  return (
    <ThemedScreen>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        <NotificationSettings />
      </ScrollView>
    </ThemedScreen>
  );
}