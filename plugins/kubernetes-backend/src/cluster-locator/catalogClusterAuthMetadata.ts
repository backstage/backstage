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

const KUBERNETES_IO_PREFIX = 'kubernetes.io/';

const BLOCKED_AUTH_METADATA_KEYS = new Set(['serviceAccountToken']);

export function filterCatalogClusterAuthMetadata(
  annotations: Record<string, string>,
): Record<string, string> {
  const filtered: Record<string, string> = {};

  for (const [key, value] of Object.entries(annotations)) {
    if (BLOCKED_AUTH_METADATA_KEYS.has(key)) {
      continue;
    }
    if (key.startsWith(KUBERNETES_IO_PREFIX)) {
      filtered[key] = value;
    }
  }

  return filtered;
}
