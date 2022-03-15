/*
 * Copyright 2022 The Backstage Authors
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

import { useCallback, useEffect, useMemo, useState } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { LogLevel, identityApiRef, useApi } from '@backstage/core-plugin-api';

import { useLogEvent } from './event';
import { useLogEntryOwners } from './entry-owner';

export interface UseLogsNotificationOptions {
  /**
   * Minimum log level to notify for
   */
  minLevel?: LogLevel;

  /**
   * Only notify if the owner match the leaf plugin in the plugin stack
   *
   * @default true
   */
  ownedLeafOnly?: boolean;

  /**
   * Only notify for logs coming from plugins owned by the current user
   */
  ownedByCurrentUser?: boolean;

  /**
   * Only notify if the logs come from plugins owned by any of these entity refs
   * (or the current user if {@link ownedByCurrentUser} is enabled)
   */
  ownedByEntityRefs?: string[];
}

export type UseLogsNotificationResult = {
  hasNotification: boolean;
  reset: () => void;
};

const levels: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * Detect when new logs are written.
 *
 * The optional `minLevel` argument can specify which level(s) to listen to.
 * Defaults to 'error'.
 *
 * Returns:
 * {
 *  hasNotification: boolean; reset: () => void;
 * }
 */
export function useLogsNotification({
  minLevel = 'error',
  ownedLeafOnly = true,
  ownedByCurrentUser = false,
  ownedByEntityRefs,
}: UseLogsNotificationOptions = {}): UseLogsNotificationResult {
  const identityApi = useApi(identityApiRef);

  const { value } = useAsync(
    () => identityApi.getBackstageIdentity(),
    [identityApi],
  );

  const ownedEntityRefs = useMemo(
    () =>
      uniqEntityRefs([
        ...(ownedByCurrentUser && value
          ? [value.userEntityRef, ...value.ownershipEntityRefs]
          : []),
        ...(ownedByEntityRefs ?? []),
      ]),
    [ownedByCurrentUser, ownedByEntityRefs, value],
  );

  const [hasNotification, setHasNotification] = useState(false);

  const lastEvent = useLogEvent();

  const entry = lastEvent?.type === 'add' ? lastEvent.entry : undefined;

  const entryOwners = useLogEntryOwners(entry);

  const filteredEntryOwners = useMemo(() => {
    if (!ownedLeafOnly) return entryOwners;
    return entryOwners.length > 0 ? [entryOwners[entryOwners.length - 1]] : [];
  }, [entryOwners, ownedLeafOnly]);

  const ownsEntry = useMemo(
    () => ownsEntryByRefs(ownedEntityRefs, filteredEntryOwners),
    [ownedEntityRefs, filteredEntryOwners],
  );

  const filterLevel = useCallback(
    (level: LogLevel) => {
      return levels[level] >= levels[minLevel];
    },
    [minLevel],
  );

  useEffect(() => {
    if (!lastEvent) return;
    if (
      lastEvent.type === 'add' &&
      filterLevel(lastEvent.entry.level) &&
      ownsEntry
    ) {
      setHasNotification(true);
    }
  }, [lastEvent, filterLevel, ownsEntry]);

  const reset = useCallback(() => {
    setHasNotification(false);
  }, []);

  if (lastEvent?.type === 'clear' && hasNotification) {
    setHasNotification(false);
  }

  return { hasNotification, reset };
}

function uniqEntityRefs(entityRefs: string[]): string[] {
  return [...new Set(entityRefs)];
}

function ownsEntryByRefs(ownedEntityRefs: string[], entryOwners: string[]) {
  if (ownedEntityRefs.length === 0) {
    return true;
  }

  const owned = new Set(ownedEntityRefs);

  return entryOwners.some(ref => owned.has(ref));
}
