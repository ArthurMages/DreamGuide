import React from 'react';

import DreamList from '../../components/DreamList';
import { ThemedScreen } from '../../components/ThemedScreen';

// Écran de consultation des rêves existants
// Note: DreamList a déjà son propre ScrollView interne, 
// donc on ne modifie pas cette page pour éviter les conflits
export default function DreamListScreen() {
  return (
    <ThemedScreen>
      <DreamList />
    </ThemedScreen>
  );
}