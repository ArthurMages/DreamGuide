import React from 'react';

import DreamForm from '../../components/DreamForm';
import { ThemedScreen } from '../../components/ThemedScreen';

// Écran de création de nouveau rêve
export default function NewDreamScreen() {
  return (
    <ThemedScreen>
      <DreamForm />
    </ThemedScreen>
  );
}