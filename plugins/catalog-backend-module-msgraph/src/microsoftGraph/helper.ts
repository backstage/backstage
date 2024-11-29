/*
 * Copyright 2020 The Backstage Authors
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
 * Takes an input string and cleans it up to become suitable as an entity name.
 *
 * @public
 */
export function normalizeEntityName(name: string): string {
  let cleaned = name
    .trim()
    .toLocaleLowerCase()
    .replace(/[^a-zA-Z0-9_\-\.]/g, '_');

  // invalid to end with _
  while (cleaned.endsWith('_')) {
    cleaned = cleaned.substring(0, cleaned.length - 1);
  }

  // cleans up format for groups like 'my group (Reader)'
  while (cleaned.includes('__')) {
    // replaceAll from node.js >= 15
    cleaned = cleaned.replace('__', '_');
  }

  return cleaned;
}
