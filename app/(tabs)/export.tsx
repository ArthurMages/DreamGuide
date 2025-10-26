import React from 'react';
import { ScrollView } from 'react-native';

import ExportDreams from '../../components/ExportDreams';
import { ThemedScreen } from '../../components/ThemedScreen';

/**
 * Écran d'export des rêves
 * Permet d'exporter les rêves dans différents formats (PDF, TXT, CSV, JSON)
 */
export default function ExportScreen() {
  return (
    <ThemedScreen>
      <ScrollView style={{ flex: 1 }}>
        <ExportDreams />
      </ScrollView>
    </ThemedScreen>
  );
}