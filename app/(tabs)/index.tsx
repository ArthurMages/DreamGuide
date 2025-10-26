import React from 'react';

import DreamForm from '../../components/DreamForm';
import { ScrollAwareScreen } from '../../components/ScrollAwareScreen';
import { ThemedScreen } from '../../components/ThemedScreen';

// Écran de création de nouveau rêve
export default function NewDreamScreen() {
  return (
    <ThemedScreen>
      <ScrollAwareScreen>
        <DreamForm />
      </ScrollAwareScreen>
    </ThemedScreen>
  );
}