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

// The default language for exported translation messages.
export const DEFAULT_LANGUAGE = 'en';

// Default file path pattern for translation message files relative to the
// translations directory. Supported placeholders: {id} and {lang}.
export const DEFAULT_MESSAGE_PATTERN = 'messages/{id}.{lang}.json';

/** Formats a message file pattern into a concrete relative path. */
export function formatMessagePath(
  pattern: string,
  id: string,
  lang: string,
): string {
  return pattern.replace(/\{id\}/g, id).replace(/\{lang\}/g, lang);
}

/** Creates a parser that extracts id and lang from a relative file path. */
export function createMessagePathParser(
  pattern: string,
): (relativePath: string) => { id: string; lang: string } | undefined {
  validatePattern(pattern);

  // Build a regex from the pattern by escaping special chars and replacing
  // {id} and {lang} with named capture groups.
  const escaped = pattern
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\\{id\\}/g, '(?<id>[^/]+)')
    .replace(/\\{lang\\}/g, '(?<lang>[a-z]{2})');

  const regex = new RegExp(`^${escaped}$`);

  return (relPath: string) => {
    const match = relPath.match(regex);
    if (!match?.groups) {
      return undefined;
    }
    return { id: match.groups.id, lang: match.groups.lang };
  };
}

/** Converts a message pattern into a glob string for discovering files. */
export function messagePatternToGlob(pattern: string): string {
  return pattern.replace(/\{id\}/g, '*').replace(/\{lang\}/g, '*');
}

/** Returns whether the pattern produces paths with subdirectories. */
export function patternHasSubdirectories(pattern: string): boolean {
  return pattern.includes('/');
}

export function validatePattern(pattern: string) {
  if (!pattern.includes('{id}')) {
    throw new Error(
      `Invalid message file pattern: must contain {id} placeholder. Got: ${pattern}`,
    );
  }
  if (!pattern.includes('{lang}')) {
    throw new Error(
      `Invalid message file pattern: must contain {lang} placeholder. Got: ${pattern}`,
    );
  }
  if (!pattern.endsWith('.json')) {
    throw new Error(
      `Invalid message file pattern: must end with .json. Got: ${pattern}`,
    );
  }
}
