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
import {
  LookupConnectionType,
  ConnectionTypeKey,
  connectionTypes,
} from '@backstage/connections';

const connectionTypesMap = new Map(Object.entries(connectionTypes));

export function getConnectionType<T extends ConnectionTypeKey>(
  key: T,
): LookupConnectionType<T> {
  return connectionTypesMap.get(key) as LookupConnectionType<T>;
}

export function isConnectionTypeKey(
  value: string | undefined,
): value is ConnectionTypeKey {
  if (!value) return false;

  return connectionTypesMap.has(value);
}
