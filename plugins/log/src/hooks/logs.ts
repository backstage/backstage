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

import { useMemo } from 'react';
import useObservable from 'react-use/lib/useObservable';
import {
  LogChange,
  StoredLogEntry,
  logStoreApiRef,
  useApi,
} from '@backstage/core-plugin-api';

export interface UseLogsResult {
  lastEvent: LogChange | undefined;
  entries: StoredLogEntry[];
}

/**
 * Listen to the log events and entires array.
 *
 * The hook will provide a new result when the log entries change.
 */
export function useLogs(): UseLogsResult {
  const logStoreApi = useApi(logStoreApiRef);
  const event = useObservable(
    useMemo(() => logStoreApi.entry$(), [logStoreApi]),
  );

  return useMemo(
    (): UseLogsResult => ({
      lastEvent: event,
      entries: [...logStoreApi.entries],
    }),
    [event, logStoreApi.entries],
  );
}
