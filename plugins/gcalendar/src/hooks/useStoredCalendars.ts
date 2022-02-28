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
import { useApi, storageApiRef } from '@backstage/core-plugin-api';
import useObservable from 'react-use/lib/useObservable';

import { gcalendarPlugin } from '../plugin';

export enum LocalStorageKeys {
  selectedCalendars = 'google_calendars_selected',
}

export function useStoredCalendars(
  defaultValue: string[],
): [string[], (value: string[]) => void] {
  const storageBucket = gcalendarPlugin.getId();
  const storageKey = LocalStorageKeys.selectedCalendars;
  const storageApi = useApi(storageApiRef).forBucket(storageBucket);
  const setValue = (value: string[]) => {
    storageApi.set(storageKey, value);
  };
  const snapshot = useObservable(
    storageApi.observe$<string[]>(storageKey),
    storageApi.snapshot(storageKey),
  );
  let result: string[];
  if (snapshot.presence === 'absent') {
    result = defaultValue;
  } else {
    result = snapshot.value!;
  }
  return [result, setValue];
}
