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
import type { ConnectionLookupIdentity } from '../api/ConnectionType';

/** Preserves configured hosts while supporting URL-based connection data. */
export function getHostLookupIdentity(config: {
  host?: string;
  baseUrl?: string;
}): ConnectionLookupIdentity | undefined {
  const value =
    config.host ?? (config.baseUrl ? new URL(config.baseUrl).host : undefined);
  return value === undefined ? undefined : { key: 'host', value };
}
