import { useLocalSearchParams } from 'expo-router';
import { getRoutineById } from '@/content/routines';
import { RoutineDetailScreen } from '@/components/routine-detail/routine-detail-screen';
import { PlaceholderScreen } from '@/components/ui/placeholder-screen';

export default function RoutineDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const routine = getRoutineById(id);

  if (!routine) {
    return <PlaceholderScreen title="Routine not found" />;
  }

  return <RoutineDetailScreen routine={routine} />;
}
