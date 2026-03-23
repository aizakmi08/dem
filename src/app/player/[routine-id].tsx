import { useLocalSearchParams } from 'expo-router';
import { getRoutineById } from '@/content/routines';
import { PlayerScreen } from '@/components/player/player-screen';
import { PlaceholderScreen } from '@/components/ui/placeholder-screen';

export default function PlayerRoute() {
  const { 'routine-id': routineId } = useLocalSearchParams<{ 'routine-id': string }>();
  const routine = getRoutineById(routineId);

  if (!routine) {
    return <PlaceholderScreen title="Routine not found" />;
  }

  return <PlayerScreen routine={routine} />;
}
