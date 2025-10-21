import { StyleSheet, ScrollView } from 'react-native';
// Assurez-vous que le composant ExportDreams.tsx existe dans /components
import ExportDreams from '@/components/ExportDreams';
import { View } from '@/components/Themed';

export default function ExportScreen() {
  return (
    <ScrollView style={styles.container}>
      <ExportDreams />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});