/*
 * Copyright 2024 The Backstage Authors
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
import { Config } from '@backstage/config';
import { SimpleIframeConfig } from '../../../../config';

export function isSimpleIframeConfig(
  value: unknown[],
): value is SimpleIframeConfig {
  if (value.length === 0) return true; // Empty array can be either type
  return typeof value[0] === 'string';
}

/**
 * Reads a config value as a string or an array of strings, and deduplicates and
 * splits by comma/space into a string array. Can also validate against a known
 * set of values. Returns undefined if the key didn't exist or if the array
 * would have ended up being empty.
 *
 * @internal
 */
export function readStringArrayOrConfigArrayFromConfig(
  root: Config | undefined,
  key: string,
): Config[] | string[] | undefined {
  if (root === undefined || !root.has(key)) {
    return undefined;
  }

  const rawValue = root.getOptional<unknown>(key);

  if (!Array.isArray(rawValue)) {
    return undefined;
  }

  if (isSimpleIframeConfig(rawValue)) {
    return root.getOptionalStringArray(key);
  }
  return root.getOptionalConfigArray(key);
}
