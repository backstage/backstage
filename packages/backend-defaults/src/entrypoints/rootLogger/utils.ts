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

/**
 * Determines if a given log field matches a specified matcher.
 *
 * The matcher can be:
 * - A string (exact match or regex pattern delimited by slashes, e.g. `/pattern/`)
 * - A non-string value (compared by strict equality)
 * - An array of matchers (returns true if any matcher matches)
 *
 * @param logField - The log field value to test for a match.
 * @param matcher - The matcher or array of matchers to compare against the log field.
 * @returns `true` if the log field matches the matcher, otherwise `false`.
 */
const isLogFieldMatching = (
  logField: unknown,
  matcher: WinstonLoggerLevelOverrideMatchers[0],
): boolean => {
  if (Array.isArray(matcher)) {
    return matcher.some(m => isLogFieldMatching(logField, m));
  }

  if (typeof matcher !== 'string') {
    return logField === matcher;
  }

  if (
    matcher.startsWith('/') &&
    matcher.endsWith('/') &&
    typeof logField === 'string'
  ) {
    const regex = new RegExp(matcher.slice(1, -1));
    return regex.test(logField);
  }

  return logField === matcher;
};

/**
 * Determines whether a log entry matches all specified override matchers.
 *
 * Iterates over each key-matcher pair in the provided `matchers` object,
 * retrieves the corresponding field from the `log` object, and checks if
 * the field matches the matcher using `isLogFieldMatching`. Returns `true`
 * only if all matchers are satisfied.
 *
 * @param log - The log entry to be checked, typically containing various log fields.
 * @param matchers - An object where each key corresponds to a log field and each value is a matcher to test against that field.
 * @returns `true` if the log entry matches all provided matchers, otherwise `false`.
 */
export const isLogMatching = (
  log: TransformableInfo,
  matchers: WinstonLoggerLevelOverrideMatchers,
): boolean => {
  const matched = Object.entries(matchers).every(([key, matcher]) => {
    const logField = log[key];
    return isLogFieldMatching(logField, matcher);
  });

  return matched;
};
