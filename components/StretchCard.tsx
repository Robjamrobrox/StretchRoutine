// Powered by OnSpace.AI
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';
import { Stretch } from '@/constants/stretches';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  stretch: Stretch;
  isCompleted: boolean;
  isExpanded: boolean;
  onToggleComplete: () => void;
  onToggleExpand: () => void;
}

export const StretchCard = React.memo(function StretchCard({
  stretch,
  isCompleted,
  isExpanded,
  onToggleComplete,
  onToggleExpand,
}: Props) {
  const checkAnim = useRef(new Animated.Value(isCompleted ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(checkAnim, {
      toValue: isCompleted ? 1 : 0,
      useNativeDriver: true,
      tension: 80,
      friction: 6,
    }).start();
  }, [isCompleted]);

  const handleToggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggleExpand();
  };

  return (
    <View style={[styles.card, isCompleted ? styles.cardCompleted : null]}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={[styles.numberBadge, isCompleted ? styles.numberBadgeCompleted : null]}>
          {isCompleted ? (
            <MaterialIcons name="check" size={14} color={Colors.background} />
          ) : (
            <Text style={styles.numberText}>{stretch.number}</Text>
          )}
        </View>
        <View style={styles.titleBlock}>
          <Text style={[styles.title, isCompleted ? styles.titleCompleted : null]} numberOfLines={2}>
            {stretch.name}
          </Text>
          <Text style={styles.subtitle}>{stretch.subtitle}</Text>
        </View>
        <Text style={styles.emoji}>{stretch.emoji}</Text>
      </View>

      {/* Sets Badge */}
      <View style={styles.setsBadge}>
        <MaterialIcons name="repeat" size={13} color={Colors.primary} />
        <Text style={styles.setsText}>{stretch.sets}</Text>
      </View>

      {/* Instructions Dropdown Toggle */}
      <Pressable
        onPress={handleToggleExpand}
        style={({ pressed }) => [styles.dropdownToggle, pressed ? styles.pressed : null]}
        hitSlop={8}
      >
        <MaterialIcons
          name="info-outline"
          size={16}
          color={Colors.textSecondary}
        />
        <Text style={styles.dropdownToggleText}>How to do this stretch</Text>
        <MaterialIcons
          name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={20}
          color={Colors.textSecondary}
        />
      </Pressable>

      {/* Expandable Instructions */}
      {isExpanded ? (
        <View style={styles.instructionsBlock}>
          <View style={styles.divider} />
          <Text style={styles.instructionText}>{stretch.instructions}</Text>
          <View style={styles.whyBlock}>
            <Text style={styles.whyLabel}>Why this works:</Text>
            <Text style={styles.whyText}>{stretch.why}</Text>
          </View>
        </View>
      ) : null}

      {/* Complete Button */}
      <Pressable
        onPress={onToggleComplete}
        style={({ pressed }) => [
          styles.completeButton,
          isCompleted ? styles.completeButtonDone : null,
          pressed ? styles.pressed : null,
        ]}
        accessibilityLabel={isCompleted ? 'Mark incomplete' : 'Mark complete'}
      >
        <Animated.View
          style={{
            transform: [
              {
                scale: checkAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 1.15, 1],
                }),
              },
            ],
          }}
        >
          <MaterialIcons
            name={isCompleted ? 'check-circle' : 'radio-button-unchecked'}
            size={20}
            color={isCompleted ? Colors.background : Colors.primary}
          />
        </Animated.View>
        <Text style={[styles.completeButtonText, isCompleted ? styles.completeButtonTextDone : null]}>
          {isCompleted ? 'Completed' : 'Mark Complete'}
        </Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardCompleted: {
    borderColor: Colors.primaryDim,
    backgroundColor: '#141F1A',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  numberBadgeCompleted: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  numberText: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    color: Colors.text,
    fontSize: FontSize.md,
    fontWeight: '700',
    lineHeight: 22,
  },
  titleCompleted: {
    color: Colors.textSecondary,
  },
  subtitle: {
    color: Colors.primary,
    fontSize: FontSize.xs,
    fontWeight: '500',
    marginTop: 2,
  },
  emoji: {
    fontSize: 24,
    marginLeft: Spacing.xs,
  },
  setsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.surfaceElevated,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: Radius.sm,
    marginBottom: Spacing.sm,
  },
  setsText: {
    color: Colors.primary,
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  dropdownToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  dropdownToggleText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.7,
  },
  instructionsBlock: {
    marginBottom: Spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.md,
  },
  instructionText: {
    color: Colors.text,
    fontSize: FontSize.sm,
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  whyBlock: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  whyLabel: {
    color: Colors.primary,
    fontSize: FontSize.xs,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  whyText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
    marginTop: Spacing.xs,
  },
  completeButtonDone: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  completeButtonText: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  completeButtonTextDone: {
    color: Colors.background,
  },
});
