import StatisticsScreen from '@/components/StatisticsScreen';
import { ThemedScreen } from '@/components/ThemedScreen';
import { StyleSheet } from 'react-native';

export default function StatsScreen() {
  return (
    <ThemedScreen>
      <StatisticsScreen />
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});