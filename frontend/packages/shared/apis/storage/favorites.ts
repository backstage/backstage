import { useState, useEffect, useMemo } from 'react';
import { useFirestore } from 'shared/apis/firestore';
import { useObservable } from 'react-use';

const COLLECTION = '/favorites/';

export type Favorite = { path: string; title: string; timestamp: string };

export function useFavorite(path: string) {
  const favoritePath = `${COLLECTION}${encodeURIComponent(path)}`;
  const firestoreApi = useFirestore();
  const favoriteSnapshot = useObservable(
    useMemo(() => firestoreApi.observe<Favorite>(favoritePath), [firestoreApi, favoritePath]),
  );

  const save = (title: string) => {
    let timestamp = new Date().toUTCString();
    return firestoreApi.set(favoritePath, { timestamp, path, title });
  };

  const remove = () => {
    return firestoreApi.delete(favoritePath);
  };

  return [favoriteSnapshot?.data, save, remove, !!favoriteSnapshot, favoriteSnapshot] as const;
}

function appendNewFavs(currentFavs: Favorite[], newFavs: Favorite[]) {
  const allFavs = currentFavs.slice();

  newFavs.forEach(newFav => {
    if (!allFavs.find(fav => fav.path === newFav.path)) {
      allFavs.push(newFav);
    }
  });

  return allFavs;
}

export function useFavoriteList() {
  const firestoreApi = useFirestore();
  const updatedFavsCol = useObservable(
    useMemo(
      () => firestoreApi.observeQuery<Favorite>({ path: COLLECTION }),
      [firestoreApi],
    ),
  );
  const [shownFavorites, setShownFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    setShownFavorites(currentFavs => {
      if (updatedFavsCol) {
        const newFavs = updatedFavsCol.docs.map(doc => doc.data!).filter(Boolean);
        return appendNewFavs(currentFavs, newFavs);
      }
      return currentFavs;
    });
  }, [updatedFavsCol]);

  return [shownFavorites, !updatedFavsCol] as const;
}
