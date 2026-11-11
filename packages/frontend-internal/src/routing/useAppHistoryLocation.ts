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

import { useSyncExternalStore } from 'use-sync-external-store/shim';
import type {
  AppHistoryApi,
  AppLocation,
} from '@backstage/frontend-plugin-api';

const noop = () => {};
const emptySubscribe = () => noop;
const emptyGetSnapshot = () => undefined;

/**
 * Reads the current app history snapshot's location.
 * The API is supplied by the caller to avoid an inlined-package import cycle.
 */
export function useAppHistoryLocation(
  appHistory: AppHistoryApi | undefined,
): AppLocation | undefined {
  const getSnapshot = appHistory?.getSnapshot ?? emptyGetSnapshot;
  const snapshot = useSyncExternalStore(
    appHistory?.subscribe ?? emptySubscribe,
    getSnapshot,
    getSnapshot,
  );
  return snapshot?.location;
}
