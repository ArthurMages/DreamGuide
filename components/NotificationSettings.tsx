import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import { Button, Divider, Switch, Text, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppTheme } from '../hooks/useAppTheme';
import { ThemedCard } from './ThemedCard';



interface Settings {
  enabled: boolean;
  morningTime: string;
  eveningTime: string;
  morningEnabled: boolean;
  eveningEnabled: boolean;
  reminderText: string;
}

export default function NotificationSettings() {
  const theme = useAppTheme();
  const [settings, setSettings] = useState<Settings>({
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
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('notificationSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error('Failed to load notification settings:', error);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
      
      if (newSettings.enabled) {
        await scheduleNotifications(newSettings);
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder les paramètres');
    }
  };

  const requestPermissions = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'Activez les notifications dans les paramètres');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Failed to request notification permissions:', error);
      Alert.alert('Erreur', 'Impossible de demander les permissions de notification');
      return false;
    }
  };

  const sanitizeNotificationText = (text: string): string => {
    return text?.replace(/[<>&"']/g, '').substring(0, 200) || '';
  };

  const scheduleNotifications = async (config: Settings) => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      const sanitizedText = sanitizeNotificationText(config.reminderText);

      if (config.morningEnabled) {
        const [hours, minutes] = config.morningTime.split(':').map(Number);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '☀️ Bonjour !',
            body: sanitizedText,
            sound: true,
          },
          trigger: {
            hour: hours,
            minute: minutes,
            repeats: true,
          },
        });
      }

      if (config.eveningEnabled) {
        const [hours, minutes] = config.eveningTime.split(':').map(Number);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '🌙 Bonne nuit !',
            body: sanitizedText,
            sound: true,
          },
          trigger: {
            hour: hours,
            minute: minutes,
            repeats: true,
          },
        });
      }
    } catch (error) {
      console.error('Failed to schedule notifications:', error);
    }
  };

  const toggleNotifications = async (value: boolean) => {
    if (value && !(await requestPermissions())) return;
    await saveSettings({ ...settings, enabled: value });
  };

  const updateTime = (type: 'morning' | 'evening', date?: Date) => {
    setShowMorningPicker(false);
    setShowEveningPicker(false);
    
    if (date) {
      const timeString = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      const newSettings = {
        ...settings,
        [type === 'morning' ? 'morningTime' : 'eveningTime']: timeString,
      };
      saveSettings(newSettings);
    }
  };

  const getDateFromTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ThemedCard>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="titleLarge" style={{ color: theme.text }}>⚙️ Notifications</Text>
            <Switch value={settings.enabled} onValueChange={toggleNotifications} />
          </View>
          
          <Divider style={styles.divider} />
          
          <Text style={{ color: theme.text, marginBottom: 16 }}>
            Configurez les rappels pour noter vos rêves.
          </Text>

          {settings.enabled && (
            <>
              <View style={styles.section}>
                <View style={styles.row}>
                  <Text style={{ color: theme.text }}>☀️ Rappel du matin</Text>
                  <Switch
                    value={settings.morningEnabled}
                    onValueChange={(value) => saveSettings({ ...settings, morningEnabled: value })}
                  />
                </View>
                {settings.morningEnabled && (
                  <Button
                    mode="outlined"
                    onPress={() => setShowMorningPicker(true)}
                    style={styles.timeButton}
                  >
                    {settings.morningTime}
                  </Button>
                )}
              </View>

              <Divider style={styles.divider} />

              <View style={styles.section}>
                <View style={styles.row}>
                  <Text style={{ color: theme.text }}>🌙 Rappel du soir</Text>
                  <Switch
                    value={settings.eveningEnabled}
                    onValueChange={(value) => saveSettings({ ...settings, eveningEnabled: value })}
                  />
                </View>
                {settings.eveningEnabled && (
                  <Button
                    mode="outlined"
                    onPress={() => setShowEveningPicker(true)}
                    style={styles.timeButton}
                  >
                    {settings.eveningTime}
                  </Button>
                )}
              </View>

              <Divider style={styles.divider} />

              <Text style={{ color: theme.text, marginBottom: 8 }}>💬 Message de rappel</Text>
              <TextInput
                value={settings.reminderText}
                onChangeText={(text) => setSettings({ ...settings, reminderText: text })}
                onBlur={() => saveSettings(settings)}
                mode="outlined"
                multiline
                numberOfLines={2}
                maxLength={200}
              />
            </>
          )}
        </View>
      </ThemedCard>

      {showMorningPicker && (
        <DateTimePicker
          value={getDateFromTime(settings.morningTime)}
          mode="time"
          display="default"
          onChange={(event, date) => updateTime('morning', date)}
        />
      )}

      {showEveningPicker && (
        <DateTimePicker
          value={getDateFromTime(settings.eveningTime)}
          mode="time"
          display="default"
          onChange={(event, date) => updateTime('evening', date)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  section: {
    marginBottom: 8,
  },
  timeButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  divider: {
    marginVertical: 16,
  },
});