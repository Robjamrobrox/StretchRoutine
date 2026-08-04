// Powered by OnSpace.AI
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  requestNotificationPermissions,
  scheduleWeeklyReminders,
  cancelDailyReminder,
} from '@/services/notificationService';

const STORAGE_KEY = 'stretch_notification_settings_v2';

// 0 = Sunday, 1 = Monday ... 6 = Saturday
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

export interface NotificationSettings {
  enabled: boolean;
  hour: number;
  minute: number;
  days: number[];
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  hour: 8,
  minute: 0,
  days: ALL_DAYS,
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
      if (newSettings.days.length > 0) {
        await scheduleWeeklyReminders(newSettings.hour, newSettings.minute, newSettings.days);
      }
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
    if (newSettings.enabled && newSettings.days.length > 0) {
      await scheduleWeeklyReminders(hour, minute, newSettings.days);
    }
  }, [settings]);

  const updateDays = useCallback(async (days: number[]) => {
    const newSettings = { ...settings, days };
    await saveSettings(newSettings);
    if (newSettings.enabled) {
      if (days.length > 0) {
        await scheduleWeeklyReminders(newSettings.hour, newSettings.minute, days);
      } else {
        await cancelDailyReminder();
      }
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
    updateDays,
    formatTime,
  };
}
