import { useEffect, useRef, useState } from 'react';
import { id } from '@instantdb/react-native';
import { db } from '@/lib/db';
import { useAuth } from '@/hooks/use-auth';
import { useSubscriptionStore } from '@/stores/use-subscription-store';
import type { PlayerStatus } from '@/stores/use-player-store';

interface UseSaveProgressOptions {
  sessionId: string;
  routineId: string;
  status: PlayerStatus;
  durationSeconds: number;
  exercisesCompleted: number;
  exercisesTotal: number;
}

export function useSaveProgress({
  sessionId,
  routineId,
  status,
  durationSeconds,
  exercisesCompleted,
  exercisesTotal,
}: UseSaveProgressOptions): void {
  const { user } = useAuth();
  const [retryNonce, setRetryNonce] = useState(0);
  const savedSessionIdRef = useRef<string | null>(null);
  const savingSessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (status !== 'complete') return;
    if (!user?.id || !routineId || !sessionId) return;
    if (savedSessionIdRef.current === sessionId) return;
    if (savingSessionIdRef.current === sessionId) return;

    const entryId = id();
    let retryTimeout: ReturnType<typeof setTimeout> | null = null;

    savingSessionIdRef.current = sessionId;

    db.transact(
      db.tx.progressEntries[entryId]
        .update({
          userId: user.id,
          routineId,
          completedAt: Date.now(),
          durationSeconds,
          exercisesCompleted,
          exercisesTotal,
        })
        .link({ $user: user.id }),
    )
      .then(() => {
        savedSessionIdRef.current = sessionId;
        useSubscriptionStore.getState().incrementSessions();
      })
      .catch((err) => {
        console.warn('[useSaveProgress] failed to save progress entry', err);
        retryTimeout = setTimeout(() => {
          setRetryNonce((value) => value + 1);
        }, 2000);
      })
      .finally(() => {
        if (savingSessionIdRef.current === sessionId) {
          savingSessionIdRef.current = null;
        }
      });

    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [
    retryNonce,
    sessionId,
    routineId,
    status,
    user?.id,
    durationSeconds,
    exercisesCompleted,
    exercisesTotal,
  ]);
}
