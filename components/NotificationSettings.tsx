import React, { useCallback, useEffect, useState } from 'react';
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
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    loadSettings();
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem('notificationSettings');
      if (saved) setSettings(prev => ({ ...prev, ...JSON.parse(saved) }));
    } catch (error) {
      console.error('Failed to load settings:', error instanceof Error ? error.message : String(error));
    }
  }, []);

  const sanitizeText = useCallback((text: string): string => 
    text?.replace(/[<>&"'`\\]|javascript:|on\w+=|data:|vbscript:|[\x00-\x1f\x7f-\x9f]/gi, '').substring(0, 200).trim() || '', []);

  const scheduleNotifications = useCallback(async (config: Settings) => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      const body = sanitizeText(config.reminderText) || "N'oubliez pas d'enregistrer votre rêve !";
      
      const scheduleTime = async (time: string, title: string) => {
        const [hour, minute] = time.split(':').map(Number);
        await Notifications.scheduleNotificationAsync({
          content: { title, body, sound: true },
          trigger: { hour, minute, repeats: true } as any,
        });
      };

      if (config.morningEnabled) await scheduleTime(config.morningTime, '☀️ Bonjour !');
      if (config.eveningEnabled) await scheduleTime(config.eveningTime, '🌙 Bonne nuit !');
    } catch (error) {
      console.error('Schedule error:', error instanceof Error ? error.message : String(error));
    }
  }, [sanitizeText]);

  const saveSettings = useCallback(async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
      await (newSettings.enabled ? scheduleNotifications(newSettings) : Notifications.cancelAllScheduledNotificationsAsync());
    } catch (error) {
      console.error('Failed to save settings:', error instanceof Error ? error.message : String(error));
    }
  }, [scheduleNotifications]);

  const requestPermissions = useCallback(async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') Alert.alert('Permission requise', 'Activez les notifications');
      return status === 'granted';
    } catch (error) {
      console.error('Permission error:', error instanceof Error ? error.message : String(error));
      return false;
    }
  }, []);

  const toggleNotifications = useCallback(async (value: boolean) => {
    if (value && !(await requestPermissions())) return;
    await saveSettings({ ...settings, enabled: value });
  }, [settings, requestPermissions, saveSettings]);

  const handleTimeChange = useCallback((type: 'morning' | 'evening', selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      type === 'morning' ? setShowMorningPicker(false) : setShowEveningPicker(false);
    }
    if (selectedDate) {
      const timeString = `${selectedDate.getHours().toString().padStart(2, '0')}:${selectedDate.getMinutes().toString().padStart(2, '0')}`;
      saveSettings({ ...settings, [type === 'morning' ? 'morningTime' : 'eveningTime']: timeString });
    }
  }, [settings, saveSettings]);

  const getDateFromTime = useCallback((timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ThemedCard>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="titleLarge" style={{ color: theme.text }}>⚙️ Notifications</Text>
            <Switch value={settings.enabled} onValueChange={toggleNotifications} />
          </View>
          
          <Divider style={styles.divider} />
          
          {settings.enabled && (
            <>
              <Text style={{ color: theme.text, marginBottom: 16 }}>
                Configurez les rappels pour noter vos rêves.
              </Text>

              <View style={styles.section}>
                <View style={styles.row}>
                  <Text style={{ color: theme.text }}>☀️ Rappel du matin</Text>
                  <Switch
                    value={settings.morningEnabled}
                    onValueChange={(value) => saveSettings({ ...settings, morningEnabled: value })}
                  />
                </View>
                <Button
                  mode="outlined"
                  onPress={() => setShowMorningPicker(true)}
                  style={styles.timeButton}
                  icon="clock-outline"
                >
                  {settings.morningTime}
                </Button>
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
                <Button
                  mode="outlined"
                  onPress={() => setShowEveningPicker(true)}
                  style={styles.timeButton}
                  icon="clock-outline"
                >
                  {settings.eveningTime}
                </Button>
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
          is24Hour
          display="default"
          onChange={(e, date) => handleTimeChange('morning', date)}
        />
      )}

      {showEveningPicker && (
        <DateTimePicker
          value={getDateFromTime(settings.eveningTime)}
          mode="time"
          is24Hour
          display="default"
          onChange={(e, date) => handleTimeChange('evening', date)}
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
    marginTop: 8,
    marginLeft: 16,
    alignSelf: 'flex-start',
  },
  divider: {
    marginVertical: 16,
  },

});