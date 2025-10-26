import React from 'react';

import NotificationSettings from '../../components/NotificationSettings';
import { ScrollAwareScreen } from '../../components/ScrollAwareScreen';
import { ThemedScreen } from '../../components/ThemedScreen';

// Écran de configuration des notifications
export default function SettingsScreen() {
  return (
    <ThemedScreen>
      <ScrollAwareScreen 
        style={{ flex: 1 }} 
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <NotificationSettings />
      </ScrollAwareScreen>
    </ThemedScreen>
  );
}