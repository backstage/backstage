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

/**
 * A path to secret config values, represented as alternating dot-separated
 * key segments and expansion markers ('[]' for arrays, '[*]' for dynamic keys).
 *
 * Examples:
 *  - Simple:  { parts: ['backend.auth.secret'], deep: false }
 *  - Array:   { parts: ['backend.auth.keys', '[]', 'secret'], deep: false }
 *  - Dynamic: { parts: ['providers', '[*]', 'clientSecret'], deep: false }
 */
export type SecretPath = {
  parts: Array<string | '[]' | '[*]'>;
  deep: boolean;
};

/**
 * Traverse a JSON schema object and extract paths to secret fields.
 */
export function extractSecretPaths(schema: Record<string, any>): SecretPath[] {
  const results: SecretPath[] = [];

  function walk(node: Record<string, any>, keys: string[]): void {
    if (!node || typeof node !== 'object') {
      return;
    }

    if (node.deepVisibility === 'secret' || node.visibility === 'secret') {
      results.push({
        parts: keysToParts(keys),
        deep: node.deepVisibility === 'secret',
      });
      return;
    }

    if (node.properties) {
      for (const [key, value] of Object.entries(node.properties)) {
        walk(value as Record<string, any>, [...keys, key]);
      }
    }

    if (node.items) {
      const items = Array.isArray(node.items) ? node.items : [node.items];
      for (const item of items) {
        walk(item as Record<string, any>, [...keys, '[]']);
      }
    }

    if (
      node.additionalProperties &&
      typeof node.additionalProperties === 'object'
    ) {
      walk(node.additionalProperties as Record<string, any>, [...keys, '[*]']);
    }
  }

  walk(schema, []);
  return results;
}

/** Group consecutive plain keys into dot-separated strings, keeping markers separate. */
function keysToParts(keys: string[]): Array<string | '[]' | '[*]'> {
  const parts: Array<string | '[]' | '[*]'> = [];
  const pending: string[] = [];

  for (const key of keys) {
    if (key === '[]' || key === '[*]') {
      if (pending.length > 0) {
        parts.push(pending.join('.'));
        pending.length = 0;
      }
      parts.push(key);
    } else {
      pending.push(key);
    }
  }

  if (pending.length > 0) {
    parts.push(pending.join('.'));
  }

  return parts;
}

/**
 * Collect all secret string values from a Config object by reading only the
 * paths described by the given secret path patterns.
 */
export function collectSecretValues(
  config: Config,
  paths: SecretPath[],
): Set<string> {
  const secrets = new Set<string>();

  for (const { parts, deep } of paths) {
    // Simple case: path is a single dot-separated key with no expansions
    if (parts.length === 1 && parts[0] !== '[]' && parts[0] !== '[*]') {
      readLeaf(config, parts[0], deep, secrets);
      continue;
    }

    // Complex case: path contains array or dynamic key expansions
    expandAndRead(config, parts, 0, deep, secrets);
  }

  return secrets;
}

/**
 * Walk the config following expansion markers ([] and [*]) in the path parts.
 * Static key segments are read directly; expansion markers enumerate the
 * matching config entries before continuing.
 *
 * The `prefix` parameter accumulates key segments from dynamic expansions
 * so that reads like `config.getOptional('github.clientSecret')` can be
 * made directly, avoiding intermediate getOptionalConfig calls.
 */
function expandAndRead(
  config: Config,
  parts: Array<string | '[]' | '[*]'>,
  index: number,
  deep: boolean,
  secrets: Set<string>,
  prefix?: string,
): void {
  if (index >= parts.length) {
    if (prefix) {
      readLeaf(config, prefix, deep, secrets);
    }
    return;
  }

  const part = parts[index];

  if (part === '[]') {
    // Array expansion — read the array using the accumulated prefix
    const key = prefix ?? '';
    const arr = config.getOptionalConfigArray(key);
    if (arr) {
      for (const item of arr) {
        expandAndRead(item, parts, index + 1, deep, secrets);
      }
    }
    return;
  }

  if (part === '[*]') {
    // Dynamic key expansion — enumerate keys under the prefix, then
    // continue with each key prepended to the remaining path.
    const parent = prefix ? config.getOptionalConfig(prefix) : config;
    if (parent) {
      for (const key of parent.keys()) {
        expandAndRead(parent, parts, index + 1, deep, secrets, key);
      }
    }
    return;
  }

  // Static key segment — accumulate into prefix and continue
  const fullKey = prefix ? `${prefix}.${part}` : part;
  expandAndRead(config, parts, index + 1, deep, secrets, fullKey);
}

function readLeaf(
  config: Config,
  key: string | undefined,
  deep: boolean,
  secrets: Set<string>,
): void {
  if (deep) {
    collectAllStrings(config.getOptional(key), secrets);
  } else {
    const value = config.getOptional(key);
    if (typeof value === 'string') {
      secrets.add(value);
    }
  }
}

function collectAllStrings(
  value: JsonValue | undefined,
  secrets: Set<string>,
): void {
  if (typeof value === 'string') {
    secrets.add(value);
  } else if (Array.isArray(value)) {
    for (const item of value) {
      collectAllStrings(item, secrets);
    }
  } else if (value !== null && typeof value === 'object') {
    for (const v of Object.values(value as Record<string, JsonValue>)) {
      collectAllStrings(v, secrets);
    }
  }
}
