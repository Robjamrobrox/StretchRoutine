// Powered by OnSpace.AI
import { useState, useCallback } from 'react';
import { Stretch } from '@/constants/stretches';

export function useRoutine(stretches: Stretch[]) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleComplete = useCallback((id: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleExpand = useCallback((id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const resetRoutine = useCallback(() => {
    setCompleted(new Set());
    setExpanded(new Set());
  }, []);

  const completedCount = completed.size;
  const totalCount = stretches.length;
  const allDone = totalCount > 0 && completedCount === totalCount;

  return {
    completed,
    expanded,
    toggleComplete,
    toggleExpand,
    resetRoutine,
    completedCount,
    totalCount,
    allDone,
  };
}
