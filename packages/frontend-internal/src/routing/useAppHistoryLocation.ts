/*
 * Copyright 2026 The Backstage Authors
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

import { useCallback, useSyncExternalStore } from 'react';
import type {
  AppHistoryApi,
  FrameworkLocation,
} from '@backstage/frontend-plugin-api';

/**
 * Subscribes to an app history's location, or to nothing when there is no app
 * history (old frontend system).
 *
 * `AppHistoryApi.location` is a stable reference that only changes when the
 * location changes, so it is the `useSyncExternalStore` snapshot directly — no
 * local mirror of the observable is needed to keep the store from looping.
 *
 * The app history is passed in rather than resolved from the API holder here.
 * `@internal/frontend` is inlined into `@backstage/frontend-plugin-api`, so
 * importing `appHistoryApiRef` at runtime would close an import cycle. Callers
 * already hold the app history, or can read it with
 * `useApi(appHistoryApiRef)`.
 */
export function useAppHistoryLocation(
  appHistory: AppHistoryApi | undefined,
): FrameworkLocation | undefined {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!appHistory) {
        return () => {};
      }
      const subscription = appHistory.location$.subscribe(() =>
        onStoreChange(),
      );
      return () => subscription.unsubscribe();
    },
    [appHistory],
  );

  const getSnapshot = useCallback(
    (): FrameworkLocation | undefined => appHistory?.location,
    [appHistory],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
