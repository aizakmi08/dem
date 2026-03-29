import { useRef } from 'react';
import { useLocalSearchParams, Redirect } from 'expo-router';
import { getRoutineById } from '@/content/routines';
import { PlayerScreen } from '@/components/player/player-screen';
import { PlaceholderScreen } from '@/components/ui/placeholder-screen';
import { useSubscriptionStore } from '@/stores/use-subscription-store';

export default function PlayerRoute() {
  const { 'routine-id': routineId } = useLocalSearchParams<{ 'routine-id': string }>();

  // Check once on mount — don't re-check when completedSessions changes mid-session
  const canStartRef = useRef(useSubscriptionStore.getState().canStartSession());

  if (!canStartRef.current) {
    return <Redirect href="/paywall" />;
  }

  const routine = getRoutineById(routineId);

  if (!routine) {
    return <PlaceholderScreen title="Routine not found" />;
  }

  return <PlayerScreen routine={routine} />;
}
