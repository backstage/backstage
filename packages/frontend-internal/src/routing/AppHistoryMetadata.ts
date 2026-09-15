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

import type { AppHistoryApi } from '@backstage/frontend-plugin-api';

/** @internal */
export type AppHistoryAction = 'PUSH' | 'REPLACE' | 'POP';

/**
 * Router-facing facts about the current browser entry. These deliberately do
 * not form part of AppLocation: they are compatibility data for first-party
 * adapters, not a second public history API.
 *
 * @internal
 */
export interface AppHistoryMetadata {
  action: AppHistoryAction;
  key: string;
  index: number;
  length: number;
  canGoBack: boolean;
}

/**
 * A global symbol keeps the private capability compatible across duplicated
 * or inlined copies of the internal package.
 *
 * @internal
 */
export const appHistoryMetadataSymbol: unique symbol = Symbol.for(
  '@backstage/app-history/metadata/v1',
) as typeof appHistoryMetadataSymbol;

/** @internal */
export interface AppHistoryWithMetadata extends AppHistoryApi {
  readonly [appHistoryMetadataSymbol]?: AppHistoryMetadata;
}

/**
 * Reads the optional metadata capability, or `undefined` when the history does
 * not implement it.
 *
 * Absence is reported as absence rather than as a stand-in record on purpose.
 * The values a stand-in would carry — `POP`, index 0, length 1, no back entry —
 * are exactly what a real history legitimately reports while it sits on its
 * first entry, so a caller handed such a record cannot tell an implemented
 * capability from a missing one. Third-party histories (a hash router, a memory
 * router, an embedding host that owns its own history) are free to omit it, and
 * every caller here has to decide deliberately what to do without it.
 */
export function readAppHistoryMetadata(
  history: AppHistoryApi,
): AppHistoryMetadata | undefined {
  return (history as AppHistoryWithMetadata)[appHistoryMetadataSymbol];
}
