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

import { useEffect, useState } from 'react';
import { useSignal } from '@backstage/plugin-signals-react';
import { NotificationSignal } from '@backstage/plugin-notifications-common';

const DefaultPollIntervalMs = 30_000;

/**
 * Listens for notification signals and falls back to polling when the signals
 * plugin is unavailable (for example in module federation remotes without a
 * shared signals API).
 *
 * @internal
 */
export function useNotificationsRefresh(options?: { pollIntervalMs?: number }) {
  const { lastSignal, isSignalsAvailable } =
    useSignal<NotificationSignal>('notifications');
  const [pollTick, setPollTick] = useState(0);
  const pollIntervalMs = options?.pollIntervalMs ?? DefaultPollIntervalMs;

  useEffect(() => {
    if (isSignalsAvailable) {
      return undefined;
    }

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        setPollTick(tick => tick + 1);
      }
    }, pollIntervalMs);

    return () => clearInterval(interval);
  }, [isSignalsAvailable, pollIntervalMs]);

  return { lastSignal, isSignalsAvailable, pollTick };
}
