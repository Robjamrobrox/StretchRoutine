// Powered by OnSpace.AI
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Pressable,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';
import { useNotificationSettings } from '@/hooks/useNotificationSettings';
import { useAlert } from '@/template';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function SettingsScreen() {
  const { settings, loading, toggleNotifications, updateTime, updateDays, formatTime } =
    useNotificationSettings();
  const { showAlert } = useAlert();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempHour, setTempHour] = useState(settings.hour);
  const [tempMinute, setTempMinute] = useState(settings.minute);
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    if (toggling) return;
    setToggling(true);
    const success = await toggleNotifications();
    setToggling(false);
    if (!success) {
      showAlert(
        'Permission Required',
        'Please enable notifications for this app in your device Settings to receive daily reminders.'
      );
    }
  };

  const openTimePicker = () => {
    setTempHour(settings.hour);
    setTempMinute(settings.minute);
    setShowTimePicker(true);
  };

  const confirmTime = async () => {
    setShowTimePicker(false);
    await updateTime(tempHour, tempMinute);
  };

  const handleToggleDay = async (day: number) => {
    if (!settings.enabled) return;
    const current = settings.days;
    let newDays: number[];
    if (current.includes(day)) {
      // Prevent deselecting last day
      if (current.length === 1) {
        showAlert('At least one day required', 'Select at least one day for reminders.');
        return;
      }
      newDays = current.filter(d => d !== day);
    } else {
      newDays = [...current, day].sort((a, b) => a - b);
    }
    await updateDays(newDays);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Reminders</Text>
          <Text style={styles.headerSubtitle}>Stay consistent with daily nudges</Text>
        </View>

        {/* Notification Toggle */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.cardIconWrap}>
              <MaterialIcons name="notifications-active" size={22} color={Colors.primary} />
            </View>
            <View style={styles.cardTextBlock}>
              <Text style={styles.cardTitle}>Daily Reminder</Text>
              <Text style={styles.cardDesc}>Get a notification to do your routine</Text>
            </View>
            <Switch
              value={settings.enabled}
              onValueChange={handleToggle}
              trackColor={{ false: Colors.border, true: Colors.primaryDim }}
              thumbColor={settings.enabled ? Colors.primary : Colors.textMuted}
              ios_backgroundColor={Colors.border}
            />
          </View>
        </View>

        {/* Time Picker */}
        <View style={[styles.card, !settings.enabled ? styles.cardDisabled : null]}>
          <Pressable
            onPress={settings.enabled ? openTimePicker : undefined}
            style={({ pressed }) => [
              styles.cardRow,
              pressed && settings.enabled ? styles.pressed : null,
            ]}
          >
            <View style={styles.cardIconWrap}>
              <MaterialIcons
                name="schedule"
                size={22}
                color={settings.enabled ? Colors.primary : Colors.textMuted}
              />
            </View>
            <View style={styles.cardTextBlock}>
              <Text style={[styles.cardTitle, !settings.enabled ? styles.textDisabled : null]}>
                Reminder Time
              </Text>
              <Text style={[styles.cardDesc, !settings.enabled ? styles.textDisabled : null]}>
                {settings.enabled
                  ? `At ${formatTime(settings.hour, settings.minute)}`
                  : 'Enable reminders to set a time'}
              </Text>
            </View>
            {settings.enabled ? (
              <View style={styles.timeBadge}>
                <Text style={styles.timeBadgeText}>
                  {formatTime(settings.hour, settings.minute)}
                </Text>
                <MaterialIcons name="chevron-right" size={18} color={Colors.primary} />
              </View>
            ) : null}
          </Pressable>
        </View>

        {/* Day Selector */}
        <View style={[styles.card, !settings.enabled ? styles.cardDisabled : null]}>
          <View style={styles.cardRowTop}>
            <View style={styles.cardIconWrap}>
              <MaterialIcons
                name="date-range"
                size={22}
                color={settings.enabled ? Colors.primary : Colors.textMuted}
              />
            </View>
            <View style={styles.cardTextBlock}>
              <Text style={[styles.cardTitle, !settings.enabled ? styles.textDisabled : null]}>
                Reminder Days
              </Text>
              <Text style={[styles.cardDesc, !settings.enabled ? styles.textDisabled : null]}>
                {settings.enabled
                  ? `${settings.days.length} day${settings.days.length !== 1 ? 's' : ''} selected`
                  : 'Enable reminders to choose days'}
              </Text>
            </View>
          </View>
          <View style={styles.dayGrid}>
            {DAY_LABELS.map((label, index) => {
              const isSelected = settings.days.includes(index);
              return (
                <Pressable
                  key={index}
                  onPress={() => handleToggleDay(index)}
                  style={({ pressed }) => [
                    styles.dayBtn,
                    isSelected && settings.enabled ? styles.dayBtnActive : null,
                    pressed && settings.enabled ? { opacity: 0.75 } : null,
                  ]}
                  accessibilityLabel={`${label} ${isSelected ? 'selected' : 'not selected'}`}
                >
                  <Text
                    style={[
                      styles.dayBtnText,
                      isSelected && settings.enabled ? styles.dayBtnTextActive : null,
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoBlock}>
          <MaterialIcons name="info-outline" size={16} color={Colors.textMuted} />
          <Text style={styles.infoText}>
            Reminders are scheduled for your selected days and time. Each session takes approximately 15 minutes.
          </Text>
        </View>

        {/* Routine Summary */}
        <Text style={styles.sectionLabel}>Your Routine</Text>
        {[
          { emoji: '🧠', name: 'Sciatic Nerve Floss', sets: '3 × 12 reps/side' },
          { emoji: '🦋', name: 'Butterfly PNF', sets: '3 × 8 reps/side' },
          { emoji: '🦵', name: 'Banded Hamstring PNF', sets: '3 × 4 reps/leg' },
          { emoji: '💪', name: 'Compression Lifts', sets: '3 × 8 reps/leg' },
        ].map((item, index) => (
          <View key={index} style={styles.routineRow}>
            <Text style={styles.routineEmoji}>{item.emoji}</Text>
            <Text style={styles.routineName}>{item.name}</Text>
            <Text style={styles.routineSets}>{item.sets}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowTimePicker(false)}>
          <Pressable style={styles.modalSheet} onPress={e => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Set Reminder Time</Text>

            <View style={styles.timePickerRow}>
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Hour</Text>
                <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                  {HOURS.map(h => (
                    <Pressable
                      key={h}
                      onPress={() => setTempHour(h)}
                      style={[styles.pickerItem, tempHour === h ? styles.pickerItemSelected : null]}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          tempHour === h ? styles.pickerItemTextSelected : null,
                        ]}
                      >
                        {h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.pickerDivider} />

              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Minute</Text>
                <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                  {MINUTES.map(m => (
                    <Pressable
                      key={m}
                      onPress={() => setTempMinute(m)}
                      style={[styles.pickerItem, tempMinute === m ? styles.pickerItemSelected : null]}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          tempMinute === m ? styles.pickerItemTextSelected : null,
                        ]}
                      >
                        :{m.toString().padStart(2, '0')}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </View>

            <Text style={styles.timePreview}>{formatTime(tempHour, tempMinute)}</Text>

            <View style={styles.modalButtons}>
              <Pressable
                style={({ pressed }) => [styles.modalCancel, pressed ? { opacity: 0.7 } : null]}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.modalConfirm, pressed ? { opacity: 0.7 } : null]}
                onPress={confirmTime}
              >
                <Text style={styles.modalConfirmText}>Confirm</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: Colors.textSecondary, fontSize: FontSize.md },
  header: { marginBottom: Spacing.lg },
  headerTitle: { color: Colors.text, fontSize: FontSize.xxl, fontWeight: '700' },
  headerSubtitle: { color: Colors.textSecondary, fontSize: FontSize.sm, marginTop: 2 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  cardDisabled: { opacity: 0.45 },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  cardRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  cardIconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextBlock: { flex: 1 },
  cardTitle: { color: Colors.text, fontSize: FontSize.md, fontWeight: '600' },
  cardDesc: { color: Colors.textSecondary, fontSize: FontSize.xs, marginTop: 2 },
  textDisabled: { color: Colors.textMuted },
  timeBadge: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  timeBadgeText: { color: Colors.primary, fontSize: FontSize.sm, fontWeight: '600' },
  pressed: { opacity: 0.7 },
  // Day grid
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  dayBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 44,
    alignItems: 'center',
  },
  dayBtnActive: {
    backgroundColor: Colors.primaryDim,
    borderColor: Colors.primary,
  },
  dayBtnText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  dayBtnTextActive: {
    color: Colors.primary,
  },
  // Info
  infoBlock: {
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.xs,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  infoText: { flex: 1, color: Colors.textMuted, fontSize: FontSize.xs, lineHeight: 18 },
  sectionLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  routineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  routineEmoji: { fontSize: 20, width: 30 },
  routineName: { flex: 1, color: Colors.text, fontSize: FontSize.sm, fontWeight: '500' },
  routineSets: { color: Colors.textSecondary, fontSize: FontSize.xs },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  modalTitle: {
    color: Colors.text,
    fontSize: FontSize.lg,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  timePickerRow: { flexDirection: 'row', height: 200, gap: Spacing.sm },
  pickerColumn: { flex: 1 },
  pickerLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  pickerScroll: { flex: 1 },
  pickerItem: {
    paddingVertical: 10,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  pickerItemSelected: { backgroundColor: Colors.primaryDim },
  pickerItemText: { color: Colors.textSecondary, fontSize: FontSize.sm },
  pickerItemTextSelected: { color: Colors.primary, fontWeight: '700' },
  pickerDivider: { width: 1, backgroundColor: Colors.border, marginVertical: Spacing.sm },
  timePreview: {
    color: Colors.primary,
    fontSize: FontSize.lg,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: Spacing.lg,
  },
  modalButtons: { flexDirection: 'row', gap: Spacing.sm },
  modalCancel: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalCancelText: { color: Colors.textSecondary, fontSize: FontSize.md, fontWeight: '600' },
  modalConfirm: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  modalConfirmText: { color: Colors.background, fontSize: FontSize.md, fontWeight: '700' },
});
