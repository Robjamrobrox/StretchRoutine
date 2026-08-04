// Powered by OnSpace.AI
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  requestNotificationPermissions,
  scheduleDailyReminder,
  cancelDailyReminder,
} from '@/services/notificationService';

const STORAGE_KEY = 'stretch_notification_settings';

interface NotificationSettings {
  enabled: boolean;
  hour: number;
  minute: number;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  hour: 8,
  minute: 0,
};

export function useNotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Load settings error:', e);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: NotificationSettings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (e) {
      console.error('Save settings error:', e);
    }
  };

  const toggleNotifications = useCallback(async (): Promise<boolean> => {
    if (!settings.enabled) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        setPermissionGranted(false);
        return false;
      }
      setPermissionGranted(true);
      const newSettings = { ...settings, enabled: true };
      await saveSettings(newSettings);
      await scheduleDailyReminder(newSettings.hour, newSettings.minute);
      return true;
    } else {
      await cancelDailyReminder();
      const newSettings = { ...settings, enabled: false };
      await saveSettings(newSettings);
      return true;
    }
  }, [settings]);

  const updateTime = useCallback(async (hour: number, minute: number) => {
    const newSettings = { ...settings, hour, minute };
    await saveSettings(newSettings);
    if (newSettings.enabled) {
      await scheduleDailyReminder(hour, minute);
    }
  }, [settings]);

  const formatTime = (hour: number, minute: number): string => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 === 0 ? 12 : hour % 12;
    const m = minute.toString().padStart(2, '0');
    return `${h}:${m} ${ampm}`;
  };

  return {
    settings,
    loading,
    permissionGranted,
    toggleNotifications,
    updateTime,
    formatTime,
  };
}
