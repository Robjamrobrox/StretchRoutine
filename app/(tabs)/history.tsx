// Powered by OnSpace.AI
import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';
import { ROUTINES } from '@/constants/stretches';
import { useHistory, DayData } from '@/hooks/useHistory';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import { SessionRecord } from '@/services/historyService';

const ROUTINE_COLORS: Record<string, string> = {
  'main-stretches': Colors.primary,
  'morning-routine': '#FFB347',
};

function formatTime(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function SessionCard({ session }: { session: SessionRecord }) {
  const color = ROUTINE_COLORS[session.routineId] ?? Colors.primary;
  return (
    <View style={styles.sessionCard}>
      <View style={[styles.sessionAccent, { backgroundColor: color }]} />
      <View style={styles.sessionBody}>
        <View style={styles.sessionTop}>
          <Text style={styles.sessionEmoji}>{session.routineEmoji}</Text>
          <Text style={styles.sessionName} numberOfLines={1}>{session.routineName}</Text>
          <Text style={styles.sessionTime}>{formatTime(session.timestamp)}</Text>
        </View>
        <View style={styles.sessionMeta}>
          <MaterialIcons name="check-circle" size={12} color={color} />
          <Text style={styles.sessionMetaText}>
            {session.completedStretchIds.length}/{session.totalStretches} stretches
          </Text>
        </View>
      </View>
    </View>
  );
}

function SevenDayGrid({ data }: { data: DayData[] }) {
  return (
    <View style={styles.gridCard}>
      <View style={styles.legendRow}>
        {ROUTINES.map(r => (
          <View key={r.id} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: ROUTINE_COLORS[r.id] ?? Colors.primary }]} />
            <Text style={styles.legendLabel} numberOfLines={1}>{r.name}</Text>
          </View>
        ))}
      </View>
      <View style={styles.dayRow}>
        {data.map(day => (
          <View
            key={day.dateKey}
            style={[
              styles.dayCol,
              day.isToday ? styles.dayColToday : null,
              day.isReminderDay && !day.isToday ? styles.dayColReminder : null,
            ]}
          >
            <Text style={[styles.dayLbl, day.isToday ? styles.dayLblToday : null]}>
              {day.dayLabel}
            </Text>
            <View style={[styles.dayNumWrap, day.isToday ? styles.dayNumWrapToday : null]}>
              <Text style={[styles.dayNumTxt, day.isToday ? styles.dayNumTxtToday : null]}>
                {day.dayNum}
              </Text>
            </View>
            <View style={styles.dotsWrap}>
              {ROUTINES.map(r => {
                const done = day.routinesCompleted.has(r.id);
                const col = ROUTINE_COLORS[r.id] ?? Colors.primary;
                return (
                  <View
                    key={r.id}
                    style={[
                      styles.dot,
                      done
                        ? { backgroundColor: col, borderColor: col }
                        : { backgroundColor: 'transparent', borderColor: Colors.border },
                    ]}
                  />
                );
              })}
            </View>
            {day.isReminderDay ? <View style={styles.reminderPip} /> : null}
          </View>
        ))}
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const { settings } = useNotificationSettings();
  const { sevenDayData, groupedSessions, streak, totalSessions, loading, reload } =
    useHistory(settings.days, settings.enabled);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>History</Text>
            <Text style={styles.headerSub}>Your completed sessions</Text>
          </View>
          <View style={styles.totalBadge}>
            <Text style={styles.totalNum}>{totalSessions}</Text>
            <Text style={styles.totalLbl}>{totalSessions === 1 ? 'session' : 'sessions'}</Text>
          </View>
        </View>

        {/* Streak Card */}
        <View style={styles.streakCard}>
          <Text style={styles.streakFire}>🔥</Text>
          <View>
            <Text style={styles.streakNum}>{streak}</Text>
            <Text style={styles.streakLbl}>Day Streak</Text>
          </View>
          <View style={styles.streakDivider} />
          <View style={styles.streakHintWrap}>
            {settings.enabled ? (
              <>
                <MaterialIcons name="notifications-active" size={13} color={Colors.primary} />
                <Text style={styles.streakHint} numberOfLines={3}>
                  Complete on your {settings.days.length} active reminder{settings.days.length !== 1 ? ' days' : ' day'} to grow your streak
                </Text>
              </>
            ) : (
              <>
                <MaterialIcons name="notifications-off" size={13} color={Colors.textMuted} />
                <Text style={styles.streakHintMuted} numberOfLines={3}>
                  Enable reminders to track a reminder-day streak
                </Text>
              </>
            )}
          </View>
        </View>

        {/* 7-Day Summary */}
        <Text style={styles.sectionLabel}>Last 7 Days</Text>
        <SevenDayGrid data={sevenDayData} />

        {/* Session Log */}
        <Text style={[styles.sectionLabel, { marginTop: Spacing.md }]}>Session Log</Text>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={Colors.primary} size="small" />
          </View>
        ) : totalSessions === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyTitle}>No sessions yet</Text>
            <Text style={styles.emptySub}>
              Complete all stretches in a routine — it will be logged here automatically.
            </Text>
          </View>
        ) : (
          groupedSessions.map(group => (
            <View key={group.dateKey} style={styles.dateGroup}>
              <Text style={styles.dateGroupLbl}>{group.dateLabel}</Text>
              {group.sessions.map(s => (
                <SessionCard key={s.id} session={s} />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: 60 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  headerTitle: { color: Colors.text, fontSize: FontSize.xxl, fontWeight: '700' },
  headerSub: { color: Colors.textSecondary, fontSize: FontSize.sm, marginTop: 2 },
  totalBadge: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    alignItems: 'center',
    minWidth: 64,
  },
  totalNum: { color: Colors.primary, fontSize: FontSize.xl, fontWeight: '800' },
  totalLbl: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Streak
  streakCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.primaryDim,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  streakFire: { fontSize: 34 },
  streakNum: { color: Colors.text, fontSize: 38, fontWeight: '800', lineHeight: 44 },
  streakLbl: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  streakDivider: { width: 1, height: 44, backgroundColor: Colors.border },
  streakHintWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  streakHint: { flex: 1, color: Colors.primary, fontSize: FontSize.xs, lineHeight: 18 },
  streakHintMuted: { flex: 1, color: Colors.textMuted, fontSize: FontSize.xs, lineHeight: 18 },

  // Section label
  sectionLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },

  // 7-day grid
  gridCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  legendRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: 4,
    marginBottom: Spacing.sm,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: '500' },
  dayRow: { flexDirection: 'row', gap: 3 },
  dayCol: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderRadius: Radius.sm,
    gap: 4,
  },
  dayColToday: {
    backgroundColor: '#141F1A',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  dayColReminder: { backgroundColor: Colors.surfaceElevated },
  dayLbl: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  dayLblToday: { color: Colors.primary },
  dayNumWrap: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  dayNumWrapToday: { backgroundColor: Colors.primary },
  dayNumTxt: { color: Colors.textSecondary, fontSize: 11, fontWeight: '700' },
  dayNumTxtToday: { color: Colors.background },
  dotsWrap: { flexDirection: 'row', gap: 3, alignItems: 'center' },
  dot: { width: 7, height: 7, borderRadius: 4, borderWidth: 1.5 },
  reminderPip: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.primary },

  // Session log
  loadingWrap: { alignItems: 'center', paddingVertical: Spacing.xl },
  emptyState: { alignItems: 'center', paddingVertical: 40, gap: Spacing.sm },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { color: Colors.text, fontSize: FontSize.lg, fontWeight: '700' },
  emptySub: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 260,
  },
  dateGroup: { marginBottom: Spacing.md },
  dateGroupLbl: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },

  // Session card
  sessionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  sessionAccent: { width: 4 },
  sessionBody: { flex: 1, padding: Spacing.sm },
  sessionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 4,
  },
  sessionEmoji: { fontSize: 16 },
  sessionName: { flex: 1, color: Colors.text, fontSize: FontSize.sm, fontWeight: '600' },
  sessionTime: { color: Colors.textMuted, fontSize: FontSize.xs },
  sessionMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  sessionMetaText: { color: Colors.textSecondary, fontSize: FontSize.xs },
});
