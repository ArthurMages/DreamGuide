import ExportDreams from '@/components/ExportDreams';
import { ScrollView, StyleSheet } from 'react-native';

export default function ExportScreen() {
  return (
    <ScrollView style={[styles.container, { backgroundColor: '#fff' }]}>
      <ExportDreams />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});