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
import {
  type NavigationControllerApi,
  type RoutingLocation,
} from '@backstage/frontend-plugin-api';

function routingLocationEqual(a: RoutingLocation, b: RoutingLocation): boolean {
  return (
    a.pathname === b.pathname &&
    a.search === b.search &&
    a.hash === b.hash &&
    a.state === b.state
  );
}

/**
 * Subscribes to a navigation controller's `location$` when one is provided.
 * Returns `undefined` when there is no controller (OFS / isolated tests).
 *
 * Kept in core-components (rather than importing the NFS-only hook) so chrome
 * can pass an already-resolved optional controller without depending on
 * `useApiHolder` semantics from the new frontend system.
 *
 * @internal
 */
export function useOptionalNavigationControllerLocation(
  navigationController: NavigationControllerApi | undefined,
): RoutingLocation | undefined {
  const snapshotRef = useRef<RoutingLocation | undefined>(undefined);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!navigationController) {
        return () => {};
      }
      const subscription = navigationController.location$.subscribe(
        location => {
          if (
            !snapshotRef.current ||
            !routingLocationEqual(snapshotRef.current, location)
          ) {
            snapshotRef.current = location;
            onStoreChange();
          }
        },
      );
      return () => subscription.unsubscribe();
    },
    [navigationController],
  );

  const getSnapshot = useCallback((): RoutingLocation | undefined => {
    if (!navigationController) {
      return undefined;
    }
    if (!snapshotRef.current) {
      const sub = navigationController.location$.subscribe(location => {
        snapshotRef.current = location;
      });
      sub.unsubscribe();
    }
    return snapshotRef.current;
  }, [navigationController]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
