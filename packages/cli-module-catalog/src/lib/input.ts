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

export function parseEntityRef(ref: string): {
  kind?: string;
  namespace?: string;
  name: string;
} {
  if (!ref.trim()) {
    throw new Error('Entity reference cannot be empty');
  }

  const colon = ref.indexOf(':');
  const kind = colon > 0 ? ref.slice(0, colon) : undefined;
  const remainder = colon > 0 ? ref.slice(colon + 1) : ref;
  const slash = remainder.indexOf('/');

  return {
    kind,
    namespace: slash > 0 ? remainder.slice(0, slash) : undefined,
    name: slash > 0 ? remainder.slice(slash + 1) : remainder,
  };
}
