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

import type { Config } from '@backstage/config';
import type { JsonValue } from '@backstage/types';
import type { JSONSchema7 as JSONSchema } from 'json-schema';
import traverse from 'json-schema-traverse';

/**
 * Collect all secret string values from a Config object by reading only the
 * config paths that are marked as secret in the given merged JSON schema.
 */
export function collectSecretValues(
  config: Config,
  mergedSchema: JSONSchema,
): Set<string> {
  const secrets = new Set<string>();

  traverse(mergedSchema, (node, jsonPtr) => {
    const s = node as JSONSchema & {
      visibility?: string;
      deepVisibility?: string;
    };

    if (s.visibility === 'secret' || s.deepVisibility === 'secret') {
      addSecrets(
        config,
        // Remove the leading '/' from the JSON pointer
        jsonPtr.split('/').slice(1),
        s.deepVisibility === 'secret',
        secrets,
      );
    }
  });

  return secrets;
}

function addSecrets(
  config: Config | undefined,
  segments: string[],
  deep: boolean,
  secrets: Set<string>,
): void {
  if (!config) {
    return;
  }

  if (segments.length === 0) {
    readStringValues(config.getOptional(), deep, secrets);
    return;
  }

  if (segments[0] === 'properties') {
    const name = segments[1];
    const rest = segments.slice(2);
    if (rest.length === 0) {
      // Leaf property — read its value directly
      readStringValues(config.getOptional(name), deep, secrets);
    } else if (rest[0] === 'items') {
      // Property is an array — read it as an array, recurse into each element
      config.getOptionalConfigArray(name)?.forEach(item => {
        addSecrets(item, rest.slice(1), deep, secrets);
      });
    } else {
      // Property is an object — descend into it
      addSecrets(config.getOptionalConfig(name), rest, deep, secrets);
    }
  } else if (segments[0] === 'additionalProperties') {
    const rest = segments.slice(1);
    config.keys().forEach(key => {
      if (rest.length === 0) {
        readStringValues(config.getOptional(key), deep, secrets);
      } else {
        addSecrets(config.getOptionalConfig(key), rest, deep, secrets);
      }
    });
  }
}

function readStringValues(
  value: JsonValue | undefined,
  deep: boolean,
  secrets: Set<string>,
): void {
  if (typeof value === 'string') {
    secrets.add(value);
  } else if (deep) {
    if (Array.isArray(value)) {
      for (const item of value) {
        readStringValues(item, deep, secrets);
      }
    } else if (value !== null && typeof value === 'object') {
      for (const v of Object.values(value as Record<string, JsonValue>)) {
        readStringValues(v, deep, secrets);
      }
    }
  }
}
