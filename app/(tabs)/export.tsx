import ExportDreams from '@/components/ExportDreams';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { ScrollView, StyleSheet } from 'react-native';

export default function ExportScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <ExportDreams />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});