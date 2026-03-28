import { useMemo, useCallback } from 'react';
import { id } from '@instantdb/react-native';
import { db } from '@/lib/db';
import { useAuth } from './use-auth';

export function useFavorites() {
  const { user } = useAuth();

  const query = useMemo(
    () =>
      user
        ? { favorites: { $: { where: { '$user.id': user.id } } } }
        : null,
    [user?.id],
  );

  const { isLoading, data } = db.useQuery(query);

  const { favoriteRoutineIds, routineToFavoriteId } = useMemo(() => {
    const entries = data?.favorites ?? [];
    const ids = new Set<string>();
    const map = new Map<string, string>();
    for (const fav of entries) {
      ids.add(fav.routineId);
      map.set(fav.routineId, fav.id);
    }
    return { favoriteRoutineIds: ids, routineToFavoriteId: map };
  }, [data?.favorites]);

  const isFavorite = useCallback(
    (routineId: string) => favoriteRoutineIds.has(routineId),
    [favoriteRoutineIds],
  );

  const toggleFavorite = useCallback(
    async (routineId: string) => {
      if (!user?.id) return;

      const existingId = routineToFavoriteId.get(routineId);
      if (existingId) {
        await db.transact(db.tx.favorites[existingId].delete());
      } else {
        const favId = id();
        await db.transact(
          db.tx.favorites[favId]
            .update({
              userId: user.id,
              routineId,
              createdAt: Date.now(),
            })
            .link({ $user: user.id }),
        );
      }
    },
    [user?.id, routineToFavoriteId],
  );

  return { isFavorite, toggleFavorite, favoriteRoutineIds, isLoading };
}
