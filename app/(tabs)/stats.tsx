import { StyleSheet } from 'react-native';
// Vérifiez que le fichier existe : components/StatisticsScreen.tsx
import StatisticsScreen from '@/components/StatisticsScreen';
import { View } from '@/components/Themed';

export default function StatsScreen() {
  return (
    <View style={[styles.container, { backgroundColor: '#fff' }]}>
      <StatisticsScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});