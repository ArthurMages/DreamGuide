import React from 'react';

import StatisticsScreen from '../../components/StatisticsScreen';
import { ThemedScreen } from '../../components/ThemedScreen';

/**
 * Écran des statistiques et analyses des rêves
 * Affiche des graphiques et métriques sur les rêves enregistrés
 * Note: StatisticsScreen a son propre ScrollView, donc pas de modification ici
 */
export default function StatsScreen() {
  return (
    <ThemedScreen>
      <StatisticsScreen />
    </ThemedScreen>
  );
}