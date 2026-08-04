// Powered by OnSpace.AI
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === 'granted';
}

/**
 * Schedule weekly reminders for specific days of the week.
 * @param hour - hour in 24h format
 * @param minute - minute
 * @param days - array of 0-6 (0 = Sunday, 6 = Saturday)
 */
export async function scheduleWeeklyReminders(
  hour: number,
  minute: number,
  days: number[]
): Promise<void> {
  await cancelDailyReminder();

  for (const day of days) {
    // expo-notifications WEEKLY weekday: 1 = Sunday ... 7 = Saturday
    const weekday = day + 1;
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Time to Stretch! 🧘',
          body: 'Your hamstring & hip routine is ready. 4 exercises, ~15 minutes.',
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday,
          hour,
          minute,
        },
      });
    } catch (e) {
      console.error('Schedule weekly notification error:', e);
    }
  }
}

export async function cancelDailyReminder(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  return await Notifications.getAllScheduledNotificationsAsync();
}
