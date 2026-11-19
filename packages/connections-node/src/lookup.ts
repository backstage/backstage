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
import {
  LookupConnectionType,
  ConnectionType,
  ConnectionLookupIdentity,
  connectionTypes,
} from '@backstage/connections';

const connectionTypesMap = new Map(Object.entries(connectionTypes));

export function getConnectionType<T extends ConnectionType>(
  key: T,
): LookupConnectionType<T> {
  return connectionTypesMap.get(key) as LookupConnectionType<T>;
}

export function isConnectionType(
  value: string | undefined,
): value is ConnectionType {
  if (!value) return false;

  return connectionTypesMap.has(value);
}

// The identity key selects how the caller's query is compared with a connection.
export function lookupIdentityFromQuery(
  key: ConnectionLookupIdentity['key'],
  query: unknown,
): string {
  switch (key) {
    case 'host': {
      const { url } = query as { url: string };
      try {
        return new URL(url).host;
      } catch {
        throw new InputError(
          `Invalid url "${url}" passed to ConnectionsService.find`,
        );
      }
    }
    default:
      throw new InputError(
        `Unsupported connection lookup identity key "${key}"`,
      );
  }
}
