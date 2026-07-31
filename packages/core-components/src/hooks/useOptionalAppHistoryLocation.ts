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

import { useCallback, useRef, useSyncExternalStore } from 'react';
import type {
  AppHistoryApi,
  FrameworkLocation,
} from '@backstage/frontend-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { frameworkLocationEqual } from '../../../frontend-plugin-api/src/routing/useObservableAsState';

/**
 * Subscribes to an app history's `location$` when one is provided.
 * Returns `undefined` when there is no app history (OFS / isolated tests).
 *
 * Kept in core-components (rather than importing the NFS-only hook) so chrome
 * can pass an already-resolved optional app history without depending on
 * `useApiHolder` semantics from the new frontend system.
 *
 * @internal
 */
export function useOptionalAppHistoryLocation(
  appHistory: AppHistoryApi | undefined,
): FrameworkLocation | undefined {
  const snapshotRef = useRef<FrameworkLocation | undefined>(undefined);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!appHistory) {
        return () => {};
      }
      const subscription = appHistory.location$.subscribe(location => {
        if (
          !snapshotRef.current ||
          !frameworkLocationEqual(snapshotRef.current, location)
        ) {
          snapshotRef.current = location;
          onStoreChange();
        }
      });
      return () => subscription.unsubscribe();
    },
    [appHistory],
  );

  const getSnapshot = useCallback((): FrameworkLocation | undefined => {
    if (!appHistory) {
      return undefined;
    }
    if (!snapshotRef.current) {
      const sub = appHistory.location$.subscribe(location => {
        snapshotRef.current = location;
      });
      sub.unsubscribe();
    }
    return snapshotRef.current;
  }, [appHistory]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
