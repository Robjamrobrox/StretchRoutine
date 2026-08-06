// Powered by OnSpace.AI
import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'stretch_session_history_v1';
const MAX_SESSIONS = 500;

export interface SessionRecord {
  id: string;
  timestamp: number;
  routineId: string;
  routineName: string;
  routineEmoji: string;
  completedStretchIds: string[];
  totalStretches: number;
}

export async function saveSession(session: Omit<SessionRecord, 'id'>): Promise<void> {
  try {
    const existing = await loadSessions();
    const record: SessionRecord = {
      ...session,
      id: `${session.timestamp}-${Math.random().toString(36).slice(2, 8)}`,
    };
    const updated = [record, ...existing].slice(0, MAX_SESSIONS);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('saveSession error:', e);
  }
}

export async function loadSessions(): Promise<SessionRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as SessionRecord[]) : [];
  } catch (e) {
    console.error('loadSessions error:', e);
    return [];
  }
}

export async function clearHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error('clearHistory error:', e);
  }
}
