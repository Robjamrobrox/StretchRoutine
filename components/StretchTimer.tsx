// Powered by OnSpace.AI
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { TimerPhase } from '@/constants/stretches';
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';

interface Props {
  phases: TimerPhase[];
}

export function StretchTimer({ phases }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(phases[0]?.duration ?? 0);
  const [isRunning, setIsRunning] = useState(false);
  const [repCount, setRepCount] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseIndexRef = useRef(0);
  const timeLeftRef = useRef(phases[0]?.duration ?? 0);

  const speakCue = useCallback((cue: string) => {
    try {
      Speech.stop();
      Speech.speak(cue, { rate: 0.85, pitch: 1.0 });
    } catch (_) {}
  }, []);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      return;
    }

    intervalRef.current = setInterval(() => {
      const newTime = timeLeftRef.current - 1;

      // Haptic tick for final 3 seconds
      if (newTime > 0 && newTime <= 3) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }

      if (newTime <= 0) {
        // Phase complete — advance
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        const currentIdx = phaseIndexRef.current;
        const nextIdx = currentIdx + 1;

        if (nextIdx >= phases.length) {
          // One full rep cycle done — loop back
          setRepCount(r => r + 1);
          const first = phases[0];
          phaseIndexRef.current = 0;
          timeLeftRef.current = first.duration;
          setPhaseIndex(0);
          setTimeLeft(first.duration);
          speakCue(first.cue);
        } else {
          const next = phases[nextIdx];
          phaseIndexRef.current = nextIdx;
          timeLeftRef.current = next.duration;
          setPhaseIndex(nextIdx);
          setTimeLeft(next.duration);
          speakCue(next.cue);
        }
      } else {
        timeLeftRef.current = newTime;
        setTimeLeft(newTime);
      }
    }, 1000);

    return clearTimer;
  }, [isRunning, phases, speakCue, clearTimer]);

  const handleStartPause = () => {
    if (!isRunning) {
      speakCue(phases[phaseIndex]?.cue ?? '');
      setIsRunning(true);
    } else {
      setIsRunning(false);
      try { Speech.stop(); } catch (_) {}
    }
  };

  const handleReset = useCallback(() => {
    clearTimer();
    try { Speech.stop(); } catch (_) {}
    setIsRunning(false);
    const first = phases[0];
    phaseIndexRef.current = 0;
    timeLeftRef.current = first?.duration ?? 0;
    setPhaseIndex(0);
    setTimeLeft(first?.duration ?? 0);
    setRepCount(0);
  }, [clearTimer, phases]);

  const handleClose = () => {
    handleReset();
    setIsVisible(false);
  };

  const currentPhase = phases[phaseIndex];
  const phaseDuration = currentPhase?.duration ?? 1;
  const elapsed = phaseDuration - timeLeft;
  const progressPct = Math.min((elapsed / phaseDuration) * 100, 100);

  if (!isVisible) {
    return (
      <Pressable
        onPress={() => setIsVisible(true)}
        style={({ pressed }) => [styles.showBtn, pressed ? { opacity: 0.7 } : null]}
        hitSlop={8}
      >
        <MaterialIcons name="timer" size={15} color={Colors.primary} />
        <Text style={styles.showBtnText}>Use Timed Phases</Text>
        <MaterialIcons name="keyboard-arrow-right" size={18} color={Colors.primary} />
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      {/* Phase tabs */}
      <View style={styles.phaseTabs}>
        {phases.map((phase, i) => (
          <View
            key={i}
            style={[
              styles.phaseTab,
              {
                backgroundColor:
                  i === phaseIndex
                    ? phase.color
                    : i < phaseIndex
                    ? phase.color + '33'
                    : Colors.surfaceElevated,
              },
            ]}
          >
            <Text
              style={[
                styles.phaseTabText,
                { color: i === phaseIndex ? Colors.background : Colors.textMuted },
              ]}
              numberOfLines={1}
            >
              {phase.name}
            </Text>
          </View>
        ))}
      </View>

      {/* Countdown */}
      <View style={styles.countdownArea}>
        <Text style={[styles.countdown, { color: currentPhase?.color ?? Colors.primary }]}>
          {String(timeLeft).padStart(2, '0')}
        </Text>
        <Text style={styles.countdownSub}>seconds</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progressPct}%`,
              backgroundColor: currentPhase?.color ?? Colors.primary,
            },
          ]}
        />
      </View>

      {/* Rep counter */}
      {repCount > 0 ? (
        <Text style={styles.repCount}>Reps completed: {repCount}</Text>
      ) : null}

      {/* Cue label */}
      <Text style={styles.cueLabel} numberOfLines={1}>
        {currentPhase?.cue ?? ''}
      </Text>

      {/* Controls */}
      <View style={styles.controls}>
        <Pressable
          onPress={handleReset}
          style={({ pressed }) => [styles.ctrlBtn, pressed ? { opacity: 0.7 } : null]}
          hitSlop={8}
          accessibilityLabel="Reset timer"
        >
          <MaterialIcons name="replay" size={22} color={Colors.textSecondary} />
        </Pressable>

        <Pressable
          onPress={handleStartPause}
          style={({ pressed }) => [
            styles.playBtn,
            { backgroundColor: currentPhase?.color ?? Colors.primary },
            pressed ? { opacity: 0.85 } : null,
          ]}
          accessibilityLabel={isRunning ? 'Pause timer' : 'Start timer'}
        >
          <MaterialIcons
            name={isRunning ? 'pause' : 'play-arrow'}
            size={32}
            color={Colors.background}
          />
        </Pressable>

        <Pressable
          onPress={handleClose}
          style={({ pressed }) => [styles.ctrlBtn, pressed ? { opacity: 0.7 } : null]}
          hitSlop={8}
          accessibilityLabel="Close timer"
        >
          <MaterialIcons name="close" size={22} color={Colors.textSecondary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  showBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  showBtnText: {
    flex: 1,
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  container: {
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  phaseTabs: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  phaseTab: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: Spacing.xs,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  phaseTabText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  countdownArea: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  countdown: {
    fontSize: 56,
    fontWeight: '800',
    lineHeight: 64,
  },
  countdownSub: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    marginBottom: Spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  repCount: {
    color: Colors.primary,
    fontSize: FontSize.xs,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  cueLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: Spacing.xs,
    fontStyle: 'italic',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
    paddingTop: Spacing.xs,
  },
  ctrlBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
