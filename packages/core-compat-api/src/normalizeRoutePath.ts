/*
 * Copyright 2025 The Backstage Authors
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

/**
 * Normalizes the path to make sure it always starts with a single '/' and do not end with '/' or '*' unless empty
 */
export function normalizeRoutePath(path: string) {
  let normalized = path;
  while (normalized.endsWith('/') || normalized.endsWith('*')) {
    normalized = normalized.slice(0, -1);
  }
  while (normalized.startsWith('/')) {
    normalized = normalized.slice(1);
  }
  if (!normalized) {
    return '/';
  }
  return `/${normalized}`;
}
