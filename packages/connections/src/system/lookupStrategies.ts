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
import type {
  LookupStrategy,
  LookupStrategyParams,
} from '../api/ConnectionType';

/**
 * The semantics of a lookup strategy: where a connection's identity is
 * stored and how to derive it from lookup parameters.
 *
 * A connection's identity is the value that distinguishes it from other
 * connections of the same type — for host-based types the configured host,
 * e.g. "ghe.example.com". The identity is stored in a connection-level
 * config field and is also derivable from the params passed to
 * `ConnectionsService.find`, which is how a lookup pairs the two.
 * Strategies without an identity field (e.g. `aws`, where the accounts live
 * in the auth entries and are selected by `matchAuth`) allow only a single
 * connection of each type.
 *
 * @public
 */
export type LookupStrategyDefinition<
  K extends LookupStrategy = LookupStrategy,
> = {
  /** Connection-level config field holding the identity, if any. */
  identityField?: string;
  /** Derives the identity from the params passed to `ConnectionsService.find`. */
  identityFromParams(params: LookupStrategyParams[K]): string | undefined;
};

/**
 * The definitions of all lookup strategies, shared by every
 * `ConnectionsService` implementation.
 *
 * Keyed by the `LookupStrategy` union so that a strategy added to the type
 * without a definition here fails to compile rather than at runtime.
 *
 * @public
 */
export const lookupStrategies: {
  [K in LookupStrategy]: LookupStrategyDefinition<K>;
} = {
  host: {
    identityField: 'host',
    identityFromParams: params => {
      try {
        return new URL(params.url).host;
      } catch {
        throw new InputError(
          `Invalid url "${params.url}" passed to ConnectionsService.find`,
        );
      }
    },
  },
  aws: {
    identityFromParams: () => undefined,
  },
};
