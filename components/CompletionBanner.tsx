// Powered by OnSpace.AI
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';

interface Props {
  onReset: () => void;
}

export function CompletionBanner({ onReset }: Props) {
  return (
    <View style={styles.container}>
      <MaterialIcons name="celebration" size={40} color={Colors.primary} />
      <Text style={styles.title}>Routine Complete!</Text>
      <Text style={styles.subtitle}>
        Great work. You have finished all 4 stretches for today.
      </Text>
      <Pressable
        onPress={onReset}
        style={({ pressed }) => [styles.resetButton, pressed ? { opacity: 0.7 } : null]}
      >
        <MaterialIcons name="refresh" size={18} color={Colors.background} />
        <Text style={styles.resetText}>Start Again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.completedBg,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryDim,
    marginBottom: Spacing.lg,
  },
  title: {
    color: Colors.primary,
    fontSize: FontSize.xxl,
    fontWeight: '700',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
  },
  resetText: {
    color: Colors.background,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
});
