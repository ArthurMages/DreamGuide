import { useAppTheme } from '@/hooks/useAppTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import { Button, Divider, Switch, Text, TextInput, useTheme } from 'react-native-paper';
import { ThemedCard } from './ThemedCard';

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface NotificationSettings {
  enabled: boolean;
  morningTime: string;
  eveningTime: string;
  morningEnabled: boolean;
  eveningEnabled: boolean;
  reminderText: string;
}

export default function NotificationSettings() {
  const theme = useAppTheme();
  const paperTheme = useTheme();
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    morningTime: '08:00',
    eveningTime: '21:00',
    morningEnabled: true,
    eveningEnabled: true,
    reminderText: "N'oubliez pas d'enregistrer votre rêve ! 🌙",
  });

  const [showMorningPicker, setShowMorningPicker] = useState(false);
  const [showEveningPicker, setShowEveningPicker] = useState(false);

  useEffect(() => {
    loadSettings();
    requestPermissions();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('notificationSettings');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erreur chargement paramètres:', error);
    }
  };

  const saveSettings = async (newSettings: NotificationSettings) => {
    try {
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(newSettings));
      setSettings(newSettings);

      // Réorganiser les notifications
      if (newSettings.enabled) {
        await scheduleNotifications(newSettings);
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
    } catch (error) {
      console.error('Erreur sauvegarde paramètres:', error);
    }
  };

  const requestPermissions = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permissions requises',
          'Les notifications sont nécessaires pour les rappels de journal de rêves.'
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Erreur permissions:', error);
      return false;
    }
  };

  const scheduleNotifications = async (config: NotificationSettings) => {
    try {
      // Annuler toutes les notifications existantes
      await Notifications.cancelAllScheduledNotificationsAsync();

      if (!config.enabled) return;

      // Notification du matin
      if (config.morningEnabled) {
        const [hours, minutes] = config.morningTime.split(':').map(Number);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '☀️ Bonjour !',
            body: config.reminderText,
            sound: true,
          },
          trigger: {
            type: Platform.OS === 'ios' ? 'calendar' : 'daily',
            hour: hours,
            minute: minutes,
            repeats: true,
          } as any, // Nécessaire pour contourner les limitations de type
        });
      }

      // Notification du soir
      if (config.eveningEnabled) {
        const [hours, minutes] = config.eveningTime.split(':').map(Number);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '🌙 Bonne nuit !',
            body: config.reminderText,
            sound: true,
          },
          trigger: {
            type: Platform.OS === 'ios' ? 'calendar' : 'daily',
            hour: hours,
            minute: minutes,
            repeats: true,
          } as any, // Nécessaire pour contourner les limitations de type
        });
      }

      Alert.alert('Succès', 'Notifications programmées avec succès !');
    } catch (error) {
      console.error('Erreur programmation notifications:', error);
      Alert.alert('Erreur', 'Impossible de programmer les notifications');
    }
  };

  const toggleNotifications = async (value: boolean) => {
    if (value) {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;
    }

    const newSettings = { ...settings, enabled: value };
    await saveSettings(newSettings);
  };

  const updateMorningTime = (event: any, selectedDate?: Date) => {
    setShowMorningPicker(false);
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      saveSettings({ ...settings, morningTime: timeString });
    }
  };

  const updateEveningTime = (event: any, selectedDate?: Date) => {
    setShowEveningPicker(false);
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      saveSettings({ ...settings, eveningTime: timeString });
    }
  };

  const getDateFromTime = (timeString: string): Date => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
  };

  const testNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🧪 Notification de test',
        body: 'Vos notifications fonctionnent correctement !',
        sound: true,
      },
      trigger: {
        type: Platform.OS === 'ios' ? 'calendar' : 'seconds',
        seconds: 2,
        repeats: false,
      } as any, // Nécessaire pour contourner les limitations de type
    });
    Alert.alert('Test envoyé', 'Vous recevrez une notification dans 2 secondes');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ThemedCard style={styles.card}>
        <View style={{ padding: 16 }}>
          <View style={styles.header}>
            <Text variant="titleLarge" style={{ color: theme.text }}>⚙️ Notifications</Text>
            <Switch
              value={settings.enabled}
              onValueChange={toggleNotifications}
            />
          </View>
          <Divider style={[styles.divider, { backgroundColor: theme.border }]} />
          <Text style={[styles.description, { color: theme.text }]}>
            Configurez les rappels pour ne pas oublier de noter vos rêves
            au réveil et avant de dormir.
          </Text>          {settings.enabled && (
            <>
              <Divider style={styles.divider} />

              {/* Rappel du matin */}
              <View style={styles.timeSection}>
                <View style={styles.timeSectionHeader}>
                  <Text style={[styles.timeLabel, { color: theme.text }]}>☀️ Rappel du matin</Text>
                  <Switch
                    value={settings.morningEnabled}
                    onValueChange={(value) =>
                      saveSettings({ ...settings, morningEnabled: value })
                    }
                  />
                </View>
                {settings.morningEnabled && (
                  <>
                    <Button
                      mode="outlined"
                      onPress={() => setShowMorningPicker(true)}
                      style={styles.timeButton}
                      textColor={theme.text}
                    >
                      {settings.morningTime}
                    </Button>
                    {showMorningPicker && (
                      <DateTimePicker
                        value={getDateFromTime(settings.morningTime)}
                        mode="time"
                        display="default"
                        onChange={updateMorningTime}
                      />
                    )}
                  </>
                )}
              </View>

              <Divider style={styles.divider} />

              {/* Rappel du soir */}
              <View style={styles.timeSection}>
                <View style={styles.timeSectionHeader}>
                  <Text style={[styles.timeLabel, { color: theme.text }]}>🌙 Rappel du soir</Text>
                  <Switch
                    value={settings.eveningEnabled}
                    onValueChange={(value) =>
                      saveSettings({ ...settings, eveningEnabled: value })
                    }
                  />
                </View>
                {settings.eveningEnabled && (
                  <>
                    <Button
                      mode="outlined"
                      onPress={() => setShowEveningPicker(true)}
                      style={styles.timeButton}
                      textColor={theme.text}
                    >
                      {settings.eveningTime}
                    </Button>
                    {showEveningPicker && (
                      <DateTimePicker
                        value={getDateFromTime(settings.eveningTime)}
                        mode="time"
                        display="default"
                        onChange={updateEveningTime}
                      />
                    )}
                  </>
                )}
              </View>

              <Divider style={styles.divider} />

              {/* Message personnalisé */}
              <View style={styles.messageSection}>
                <Text style={[styles.timeLabel, { color: theme.text }]}>💬 Message de rappel</Text>
                <TextInput
                  value={settings.reminderText}
                  onChangeText={(text) =>
                    setSettings({ ...settings, reminderText: text })
                  }
                  mode="outlined"
                  multiline
                  numberOfLines={2}
                  style={styles.messageInput}
                  onBlur={() => saveSettings(settings)}
                  textColor={theme.text}
                  theme={paperTheme}
                />
              </View>

              <Divider style={styles.divider} />

              {/* Bouton de test */}
              <Button
                mode="outlined"
                onPress={testNotification}
                style={styles.testButton}
                icon="bell-ring"
                textColor={theme.text}
              >
                Tester les notifications
              </Button>
            </>
          )}
        </View>
      </ThemedCard>

      <ThemedCard style={styles.card}>
        <View style={{ padding: 16 }}>
          <Text style={[styles.infoTitle, { color: theme.text }]}>ℹ️ Conseils</Text>
          <Text style={[styles.infoText, { color: theme.text }]}>
            • Programmez un rappel le matin pour noter vos rêves au réveil{'\n'}
            • Le rappel du soir peut vous aider à vous préparer mentalement{'\n'}
            • La régularité aide à améliorer la mémorisation des rêves{'\n'}
            • Gardez votre journal près de votre lit{'\n'}
            • Écrivez dès le réveil, avant que les détails ne s'estompent
          </Text>
        </View>
      </ThemedCard>

      <ThemedCard style={styles.card}>
        <View style={{ padding: 16 }}>
          <Text style={[styles.infoTitle, { color: theme.text }]}>🎯 Objectifs suggérés</Text>
          <View style={styles.goalItem}>
            <Text style={styles.goalEmoji}>📝</Text>
            <Text style={[styles.goalText, { color: theme.text }]}>Enregistrer au moins 1 rêve par semaine</Text>
          </View>
          <View style={styles.goalItem}>
            <Text style={styles.goalEmoji}>✨</Text>
            <Text style={[styles.goalText, { color: theme.text }]}>Essayer d'avoir un rêve lucide par mois</Text>
          </View>
          <View style={styles.goalItem}>
            <Text style={styles.goalEmoji}>📊</Text>
            <Text style={[styles.goalText, { color: theme.text }]}>Consulter vos statistiques régulièrement</Text>
          </View>
        </View>
      </ThemedCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    width: '100%',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    marginVertical: 16,
  },
  timeSection: {
    marginBottom: 8,
  },
  timeSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeButton: {
    marginTop: 8,
  },
  messageSection: {
    marginBottom: 8,
  },
  messageInput: {
    marginTop: 8,
  },
  testButton: {
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  goalText: {
    fontSize: 14,
    flex: 1,
  },
});