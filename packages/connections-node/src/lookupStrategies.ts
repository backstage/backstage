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
import { InputError } from '@backstage/errors';
import type { LookupStrategy } from '@backstage/connections';

// The concrete strategy is only known at runtime, so definitions receive the
// query with its type erased and narrow it to their own query shape.
type LookupStrategyDefinition = {
  identityField?: string;
  identityFromQuery(query: unknown): string | undefined;
};

/**
 * The definitions of all lookup strategies, keyed by the `lookupStrategy` of
 * each connection type. Each definition knows how to derive the identity to
 * match connections against from the query passed to `ConnectionsService.find`.
 *
 * @internal
 */
export const lookupStrategies: Record<
  LookupStrategy,
  LookupStrategyDefinition
> = {
  host: {
    identityField: 'host',
    identityFromQuery(query) {
      const { url } = query as { url: string };
      try {
        return new URL(url).host;
      } catch {
        throw new InputError(
          `Invalid url "${url}" passed to ConnectionsService.find`,
        );
      }
    },
  },
  // AWS has no identity field to match against — all accounts live under a
  // single connection. Account selection is handled entirely by the
  // connection type's matchAuth implementation.
  aws: {
    identityFromQuery() {
      return undefined;
    },
  },
};
