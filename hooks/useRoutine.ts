// Powered by OnSpace.AI
import { useState, useCallback } from 'react';
import { STRETCHES } from '@/constants/stretches';

export function useRoutine() {
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
  }, []);

  const completedCount = completed.size;
  const totalCount = STRETCHES.length;
  const allDone = completedCount === totalCount;

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
