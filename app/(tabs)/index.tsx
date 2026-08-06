// Powered by OnSpace.AI
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';
import { ROUTINES, Routine } from '@/constants/stretches';
import { useRoutine } from '@/hooks/useRoutine';
import { StretchCard } from '@/components/StretchCard';
import { ProgressBar } from '@/components/ProgressBar';
import { CompletionBanner } from '@/components/CompletionBanner';
import { saveSession } from '@/services/historyService';

function RoutineContent({ routine }: { routine: Routine }) {
  const {
    completed,
    expanded,
    toggleComplete,
    toggleExpand,
    resetRoutine,
    completedCount,
    totalCount,
    allDone,
  } = useRoutine(routine.stretches);

  const wasDoneRef = useRef(false);

  useEffect(() => {
    if (allDone && !wasDoneRef.current) {
      wasDoneRef.current = true;
      saveSession({
        timestamp: Date.now(),
        routineId: routine.id,
        routineName: routine.name,
        routineEmoji: routine.emoji,
        completedStretchIds: routine.stretches.map(s => s.id),
        totalStretches: routine.stretches.length,
      });
    } else if (!allDone && wasDoneRef.current) {
      wasDoneRef.current = false;
    }
  }, [allDone, routine]);

  return (
    <>
      <ProgressBar completed={completedCount} total={totalCount} />

      {allDone ? (
        <CompletionBanner onReset={resetRoutine} />
      ) : null}

      {routine.stretches.map(stretch => (
        <StretchCard
          key={stretch.id}
          stretch={stretch}
          isCompleted={completed.has(stretch.id)}
          isExpanded={expanded.has(stretch.id)}
          onToggleComplete={() => toggleComplete(stretch.id)}
          onToggleExpand={() => toggleExpand(stretch.id)}
        />
      ))}

      <View style={styles.tip}>
        <MaterialIcons name="lightbulb-outline" size={14} color={Colors.primary} />
        <Text style={styles.tipText}>
          Complete each stretch in order for best results
        </Text>
      </View>
    </>
  );
}

export default function RoutineScreen() {
  const [selectedId, setSelectedId] = useState<string>(ROUTINES[0].id);
  const [showPicker, setShowPicker] = useState(false);

  const selectedRoutine = ROUTINES.find(r => r.id === selectedId) ?? ROUTINES[0];

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
    setShowPicker(false);
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.appTitle}>Stretch Routine</Text>
            <Text style={styles.appSubtitle}>Hip Flexibility Program</Text>
          </View>
          <View style={styles.headerBadge}>
            <MaterialIcons name="fitness-center" size={18} color={Colors.primary} />
          </View>
        </View>

        {/* Routine Selector */}
        <View style={styles.selectorRow}>
          {ROUTINES.map(routine => {
            const isActive = routine.id === selectedId;
            return (
              <Pressable
                key={routine.id}
                onPress={() => handleSelect(routine.id)}
                style={({ pressed }) => [
                  styles.routineTab,
                  isActive ? styles.routineTabActive : null,
                  pressed ? { opacity: 0.75 } : null,
                ]}
                accessibilityLabel={`Switch to ${routine.name}`}
              >
                <Text style={styles.routineTabEmoji}>{routine.emoji}</Text>
                <View style={styles.routineTabTextBlock}>
                  <Text
                    style={[
                      styles.routineTabName,
                      isActive ? styles.routineTabNameActive : null,
                    ]}
                    numberOfLines={1}
                  >
                    {routine.name}
                  </Text>
                  <Text
                    style={[
                      styles.routineTabDuration,
                      isActive ? styles.routineTabDurationActive : null,
                    ]}
                  >
                    {routine.duration}
                  </Text>
                </View>
                {isActive ? (
                  <View style={styles.activeIndicator} />
                ) : null}
              </Pressable>
            );
          })}
        </View>

        {/* Routine Description */}
        <View style={styles.descriptionRow}>
          <MaterialIcons name="info-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.descriptionText}>{selectedRoutine.description}</Text>
          <Text style={styles.countBadge}>
            {selectedRoutine.stretches.length} exercises
          </Text>
        </View>

        {/* Routine Content — key forces full remount on routine switch */}
        <RoutineContent key={selectedId} routine={selectedRoutine} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  headerLeft: {
    flex: 1,
  },
  appTitle: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  appSubtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  headerBadge: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.primaryDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Routine Selector
  selectorRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  routineTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.sm,
    minHeight: 60,
    position: 'relative',
    overflow: 'hidden',
  },
  routineTabActive: {
    borderColor: Colors.primary,
    backgroundColor: '#141F1A',
  },
  routineTabEmoji: {
    fontSize: 22,
  },
  routineTabTextBlock: {
    flex: 1,
  },
  routineTabName: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  routineTabNameActive: {
    color: Colors.primary,
  },
  routineTabDuration: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    marginTop: 1,
  },
  routineTabDurationActive: {
    color: Colors.primaryDim,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  // Description
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.md,
    paddingHorizontal: 2,
  },
  descriptionText: {
    flex: 1,
    color: Colors.textMuted,
    fontSize: FontSize.xs,
  },
  countBadge: {
    color: Colors.primary,
    fontSize: FontSize.xs,
    fontWeight: '700',
    backgroundColor: Colors.primaryDim,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  // Tip
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.xs,
    marginTop: Spacing.sm,
  },
  tipText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    flex: 1,
  },
});
