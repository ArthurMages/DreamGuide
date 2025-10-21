import { StyleSheet, ScrollView } from 'react-native';
// Vérifiez que le fichier existe : components/NotificationSettings.tsx
// Si le fichier s'appelle NotificationSetting.tsx, changez l'import
import NotificationSettings from '@/components/NotificationSettings';
import { View } from '@/components/Themed';

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container}>
      <NotificationSettings />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});