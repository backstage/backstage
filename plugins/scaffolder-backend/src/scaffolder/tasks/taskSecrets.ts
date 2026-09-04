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

import type { TaskSecrets } from '@backstage/plugin-scaffolder-node';
import type { JsonValue } from '@backstage/types';

function collectStrings(value: JsonValue, result: string[]): void {
  if (typeof value === 'string') {
    result.push(value);
  } else if (Array.isArray(value)) {
    value.forEach(child => collectStrings(child, result));
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach(child => {
      if (child !== undefined) {
        collectStrings(child, result);
      }
    });
  }
}

export function collectCredentialSecretValues(credentials: unknown): string[] {
  if (
    (typeof credentials !== 'object' || credentials === null) &&
    typeof credentials !== 'function'
  ) {
    return [];
  }

  const token = (credentials as { token?: unknown }).token;
  return typeof token === 'string' ? [token] : [];
}

export function collectTaskSecretValues(
  secrets: TaskSecrets | undefined,
  options?: { strictCredentials?: boolean },
): string[] {
  const values: string[] = [];
  for (const [key, value] of Object.entries(secrets ?? {})) {
    if (key !== '__initiatorCredentials' && value !== undefined) {
      collectStrings(value as JsonValue, values);
    }
  }

  const serializedCredentials = secrets?.__initiatorCredentials;
  if (serializedCredentials) {
    values.push(serializedCredentials);
    try {
      values.push(
        ...collectCredentialSecretValues(JSON.parse(serializedCredentials)),
      );
    } catch (error) {
      if (options?.strictCredentials) {
        throw error;
      }
    }
  }

  return Array.from(
    new Set(
      values.map(value => value.trim()).filter(value => value.length > 1),
    ),
  );
}
