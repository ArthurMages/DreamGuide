import NotificationSettings from '@/components/NotificationSettings';
import { ThemedScreen } from '@/components/ThemedScreen';
import { ScrollView, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  return (
    <ThemedScreen>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <NotificationSettings />
      </ScrollView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
});