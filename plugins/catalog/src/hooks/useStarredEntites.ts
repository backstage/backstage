/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { useState, useEffect } from 'react';
import { useApi, storageApiRef } from '@backstage/core';

export const useStarredEntities = () => {
  const storageApi = useApi(storageApiRef);
  const settingsStore = storageApi.forBucket('settings');
  const rawStarredItems = settingsStore.get<string[]>('starredEntities') ?? [];
  const [starredEntities, setStarredEntities] = useState(
    new Set(rawStarredItems),
  );

  useEffect(() => {
    const subscription = settingsStore
      .observe$<string[]>('starredEntities')
      .subscribe(message => {
        const newItems = message.newValue ?? [];
        setStarredEntities(new Set(newItems));
      });

    return () => subscription.unsubscribe();
  }, [settingsStore]);

  return {
    starredEntities,
  };
};
