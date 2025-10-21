import ExportDreams from '@/components/ExportDreams';
import { ThemedScreen } from '@/components/ThemedScreen';
import { ScrollView, StyleSheet } from 'react-native';

export default function ExportScreen() {
  return (
    <ThemedScreen>
      <ScrollView style={styles.container}>
        <ExportDreams />
      </ScrollView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});