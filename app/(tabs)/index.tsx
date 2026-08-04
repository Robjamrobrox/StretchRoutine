// Powered by OnSpace.AI
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';
import { STRETCHES } from '@/constants/stretches';
import { useRoutine } from '@/hooks/useRoutine';
import { StretchCard } from '@/components/StretchCard';
import { ProgressBar } from '@/components/ProgressBar';
import { CompletionBanner } from '@/components/CompletionBanner';

export default function RoutineScreen() {
  const {
    completed,
    expanded,
    toggleComplete,
    toggleExpand,
    resetRoutine,
    completedCount,
    totalCount,
    allDone,
  } = useRoutine();

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
            <Text style={styles.headerTitle}>Hamstring Routine</Text>
            <Text style={styles.headerSubtitle}>Hip Flexibility Program</Text>
          </View>
          <View style={styles.headerBadge}>
            <MaterialIcons name="fitness-center" size={18} color={Colors.primary} />
          </View>
        </View>

        {/* Progress */}
        <ProgressBar completed={completedCount} total={totalCount} />

        {/* Completion Banner */}
        {allDone ? (
          <CompletionBanner onReset={resetRoutine} />
        ) : null}

        {/* Stretch Cards */}
        {STRETCHES.map(stretch => (
          <StretchCard
            key={stretch.id}
            stretch={stretch}
            isCompleted={completed.has(stretch.id)}
            isExpanded={expanded.has(stretch.id)}
            onToggleComplete={() => toggleComplete(stretch.id)}
            onToggleExpand={() => toggleExpand(stretch.id)}
          />
        ))}

        {/* Footer tip */}
        <View style={styles.tip}>
          <MaterialIcons name="lightbulb-outline" size={14} color={Colors.primary} />
          <Text style={styles.tipText}>
            Complete each stretch in order for best results
          </Text>
        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  headerSubtitle: {
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
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm,
    marginTop: Spacing.sm,
  },
  tipText: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    flex: 1,
  },
});
