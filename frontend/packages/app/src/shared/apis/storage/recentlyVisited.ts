import { useMemo } from 'react';
import { getFirestoreApi, useFirestore } from 'shared/apis/firestore';
import { useObservable } from 'react-use';

const COLLECTION = '/recentlyVisited/';

export type RecentlyVisitedItem = {
  path: string;
  name: string;
  timestamp: number;
};

export async function addRecentlyVisited(item: RecentlyVisitedItem): Promise<void> {
  await getFirestoreApi().set(`${COLLECTION}${encodeURIComponent(item.path)}`, item);
}

export function useRecentlyVisited(limit: number = 10): RecentlyVisitedItem[] {
  const firestoreApi = useFirestore();
  const queryResult = useObservable(
    useMemo(
      () =>
        firestoreApi.observeQuery<RecentlyVisitedItem>({
          limit,
          path: COLLECTION,
          orderBy: {
            field: 'timestamp',
            direction: 'desc',
          },
        }),
      [firestoreApi, limit],
    ),
  );

  return (queryResult?.docs || []).filter(s => s.exists).map(s => s.data!);
}
