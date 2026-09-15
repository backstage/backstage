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

import type {
  AppHistoryApi,
  AppLocation,
} from '@backstage/frontend-plugin-api';
import type { Observable } from '@backstage/types';
import {
  appHistoryMetadataSymbol,
  readAppHistoryMetadata,
  type AppHistoryMetadata,
} from './AppHistoryMetadata';

const location: AppLocation = {
  pathname: '/',
  search: '',
  hash: '',
  state: undefined,
};

const location$: Observable<AppLocation> = {
  subscribe: () => ({ unsubscribe: () => {}, closed: false }),
  [Symbol.observable]() {
    return this;
  },
};

/** The minimum a third-party history has to implement. */
function createBareHistory(): AppHistoryApi {
  return {
    location,
    location$,
    navigate: () => {},
    createHref: (to: string) => to,
  };
}

/**
 * The facts a history reports while it sits on the first entry of a fresh
 * stack. This is also exactly what a stand-in for "no metadata at all" would
 * have to say, which is why absence must not be signalled by a record.
 */
const FIRST_ENTRY: AppHistoryMetadata = {
  action: 'POP',
  key: 'default',
  index: 0,
  length: 1,
  canGoBack: false,
};

describe('readAppHistoryMetadata', () => {
  it('should report absence for a history that does not implement the capability', () => {
    expect(readAppHistoryMetadata(createBareHistory())).toBeUndefined();
  });

  it('should distinguish a first-entry report from no report at all', () => {
    const withCapability: AppHistoryApi = {
      ...createBareHistory(),
      [appHistoryMetadataSymbol]: FIRST_ENTRY,
    } as AppHistoryApi;

    // Both histories are on the first entry of a single-entry stack, so every
    // value the capability could carry is the value a stand-in would have
    // carried. Only the presence of the capability tells them apart.
    expect(readAppHistoryMetadata(withCapability)).toEqual(FIRST_ENTRY);
    expect(readAppHistoryMetadata(createBareHistory())).toBeUndefined();
  });

  it('should read live, so a history backed by a getter is not snapshotted', () => {
    let entry: AppHistoryMetadata = FIRST_ENTRY;
    const history: AppHistoryApi = {
      ...createBareHistory(),
      get [appHistoryMetadataSymbol]() {
        return entry;
      },
    } as AppHistoryApi;

    expect(readAppHistoryMetadata(history)).toEqual(FIRST_ENTRY);
    entry = {
      action: 'PUSH',
      key: 'second',
      index: 1,
      length: 2,
      canGoBack: true,
    };
    expect(readAppHistoryMetadata(history)).toEqual(entry);
  });

  it('should be reachable through the global symbol without importing it', () => {
    // The capability is deliberately keyed on a global symbol so a history from
    // a package that never depends on this one — or on a duplicated copy of it
    // — can still implement it. A third party looks the symbol up by name.
    const thirdPartySymbol = Symbol.for('@backstage/app-history/metadata/v1');
    const history = {
      ...createBareHistory(),
      [thirdPartySymbol]: FIRST_ENTRY,
    } as AppHistoryApi;

    expect(thirdPartySymbol).toBe(appHistoryMetadataSymbol);
    expect(readAppHistoryMetadata(history)).toEqual(FIRST_ENTRY);
  });
});
