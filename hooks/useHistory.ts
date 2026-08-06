// Powered by OnSpace.AI
import { useState, useEffect, useCallback } from 'react';
import { loadSessions, SessionRecord } from '@/services/historyService';

export type { SessionRecord };

export interface DayData {
  dateKey: string;
  dayLabel: string;
  dayNum: string;
  isReminderDay: boolean;
  isToday: boolean;
  routinesCompleted: Set<string>;
}

export interface GroupedSessions {
  dateKey: string;
  dateLabel: string;
  sessions: SessionRecord[];
}

const DAY_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function getDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
}

function formatDateLabel(dk: string): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (dk === getDateKey(today)) return 'Today';
  if (dk === getDateKey(yesterday)) return 'Yesterday';
  const [y, m, d] = dk.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export function useHistory(reminderDays: number[], isReminderEnabled: boolean) {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const data = await loadSessions();
    setSessions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const today = new Date();
  const todayKey = getDateKey(today);

  // 7-day summary
  const sevenDayData: DayData[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dk = getDateKey(d);
    const dow = d.getDay();
    const daySessions = sessions.filter(s => getDateKey(new Date(s.timestamp)) === dk);
    sevenDayData.push({
      dateKey: dk,
      dayLabel: DAY_SHORT[dow],
      dayNum: String(d.getDate()),
      isReminderDay: isReminderEnabled && reminderDays.includes(dow),
      isToday: i === 0,
      routinesCompleted: new Set(daySessions.map(s => s.routineId)),
    });
  }

  // Grouped session list
  const groupedSessions: GroupedSessions[] = [];
  const dateMap = new Map<string, SessionRecord[]>();
  for (const s of sessions) {
    const dk = getDateKey(new Date(s.timestamp));
    if (!dateMap.has(dk)) dateMap.set(dk, []);
    dateMap.get(dk)!.push(s);
  }
  for (const [dk, list] of dateMap.entries()) {
    groupedSessions.push({ dateKey: dk, dateLabel: formatDateLabel(dk), sessions: list });
  }

  // Streak calculation
  const completionDateKeys = new Set(sessions.map(s => getDateKey(new Date(s.timestamp))));
  let streak = 0;

  if (isReminderEnabled && reminderDays.length > 0) {
    const reminderSet = new Set(reminderDays);
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dk = getDateKey(d);
      if (!reminderSet.has(d.getDay())) continue;
      if (completionDateKeys.has(dk)) {
        streak++;
      } else if (dk === todayKey) {
        continue; // Today not yet done — don't break streak
      } else {
        break;
      }
    }
  } else {
    // Fallback: consecutive calendar days
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dk = getDateKey(d);
      if (completionDateKeys.has(dk)) {
        streak++;
      } else if (dk === todayKey) {
        continue;
      } else {
        break;
      }
    }
  }

  return {
    sessions,
    loading,
    sevenDayData,
    groupedSessions,
    streak,
    totalSessions: sessions.length,
    reload,
  };
}
