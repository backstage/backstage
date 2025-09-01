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

import { TransformableInfo } from 'logform';
import { WinstonLoggerLevelOverrideMatchers } from './types';

/** Parse a slash-delimited regex like `/pattern/flags` into a RegExp, or null if not a regex-string */
const parseRegex = (s: string): RegExp | null => {
  if (!s.startsWith('/')) return null;
  const lastSlash = s.lastIndexOf('/');
  if (lastSlash <= 0) return null;

  const pattern = s.slice(1, lastSlash);
  const flags = s.slice(lastSlash + 1);

  try {
    return new RegExp(pattern, flags);
  } catch {
    return null; // fall back to treating it as a plain string
  }
};

/**
 * Create a predicate function that determines whether a log field matches a given matcher.
 *
 * The matcher can be:
 * - A string (exact match or regex pattern delimited by slashes, e.g. `/pattern/`)
 * - A non-string value (compared by strict equality)
 * - An array of matchers (returns true if any matcher matches)
 *
 * @param matcher - The matcher or array of matchers to compare against the log field.
 * @returns A function that takes a log field and returns `true` if it matches the matcher, otherwise `false`.
 */
const createLogFieldMatcher = (
  matcher: WinstonLoggerLevelOverrideMatchers[0],
): ((logField: unknown) => boolean) => {
  // Array of matchers: create predicates for each element and OR them together
  if (Array.isArray(matcher)) {
    const fns = matcher.map(m => createLogFieldMatcher(m));
    return (logField: unknown) => fns.some(fn => fn(logField));
  }

  // Non-string matcher: strict equality
  if (typeof matcher !== 'string') {
    return (logField: unknown) => logField === matcher;
  }

  // String matcher: maybe a slash-delimited regex (/pattern/flags)
  const regex = parseRegex(matcher);
  if (regex) {
    return (logField: unknown) =>
      typeof logField === 'string' && regex.test(logField);
  }

  // Plain string matcher: strict equality
  return (logField: unknown) => logField === matcher;
};

/**
 * Create a predicate function that determines whether a log entry matches
 * all specified override matchers.
 *
 * Iterates over each key-matcher pair in the provided `matchers` object,
 * retrieves the corresponding field from the `log` object, and checks if
 * the field matches the matcher using `isLogFieldMatching`. Returns `true`
 * only if all matchers are satisfied.
 *
 * @param matchers - An object where each key corresponds to a log field and each value is a matcher to test against that field.
 * @returns A function that takes a log entry and returns `true` if it matches all specified matchers, otherwise `false`.
 */
export const createLogMatcher = (
  matchers: WinstonLoggerLevelOverrideMatchers,
): ((log: TransformableInfo) => boolean) => {
  const logFieldMatchers = Object.entries(matchers).map(([key, m]) => {
    const fn = createLogFieldMatcher(m);
    return [key, fn] as const;
  });

  return (log: TransformableInfo) =>
    logFieldMatchers.every(([key, fn]) => fn(log[key]));
};
