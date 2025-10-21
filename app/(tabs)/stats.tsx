import { StyleSheet } from 'react-native';
// Vérifiez que le fichier existe : components/StatisticsScreen.tsx
import StatisticsScreen from '@/components/StatisticsScreen';
import { Text, View } from '@/components/Themed';

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      <StatisticsScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});