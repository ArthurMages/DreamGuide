import NotificationSettings from '@/components/NotificationSettings';
import { ThemedScreen } from '@/components/ThemedScreen';
import { StyleSheet } from 'react-native';

export default function SettingsScreen() {
  return (
    <ThemedScreen>
      <NotificationSettings />
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});