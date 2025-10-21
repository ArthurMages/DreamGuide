import { ScrollView, StyleSheet } from 'react-native';
// Vérifiez que le fichier existe : components/NotificationSettings.tsx
// Si le fichier s'appelle NotificationSetting.tsx, changez l'import
import NotificationSettings from '@/components/NotificationSettings';

export default function SettingsScreen() {
  return (
    <ScrollView style={[styles.container, { backgroundColor: '#fff' }]}>
      <NotificationSettings />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});