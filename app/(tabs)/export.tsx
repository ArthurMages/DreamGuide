import React from 'react';

import ExportDreams from '../../components/ExportDreams';
import { ScrollAwareScreen } from '../../components/ScrollAwareScreen';
import { ThemedScreen } from '../../components/ThemedScreen';

/**
 * Écran d'export des rêves
 * Permet d'exporter les rêves dans différents formats (PDF, TXT, CSV, JSON)
 */
export default function ExportScreen() {
  return (
    <ThemedScreen>
      <ScrollAwareScreen style={{ flex: 1 }}>
        <ExportDreams />
      </ScrollAwareScreen>
    </ThemedScreen>
  );
}