import { useLocalSearchParams, Redirect } from 'expo-router';
import { getRoutineById } from '@/content/routines';
import { PlayerScreen } from '@/components/player/player-screen';
import { PlaceholderScreen } from '@/components/ui/placeholder-screen';
import { useSubscriptionStore } from '@/stores/use-subscription-store';

export default function PlayerRoute() {
  const { 'routine-id': routineId } = useLocalSearchParams<{ 'routine-id': string }>();
  const canStart = useSubscriptionStore((s) => s.canStartSession());

  if (!canStart) {
    return <Redirect href="/paywall" />;
  }

  const routine = getRoutineById(routineId);

  if (!routine) {
    return <PlaceholderScreen title="Routine not found" />;
  }

  return <PlayerScreen routine={routine} />;
}
