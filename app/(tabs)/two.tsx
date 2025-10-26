import React from 'react';

import DreamList from '../../components/DreamList';
import { ThemedScreen } from '../../components/ThemedScreen';

// Écran de consultation des rêves existants
export default function DreamListScreen() {
  return (
    <ThemedScreen>
      <DreamList />
    </ThemedScreen>
  );
}