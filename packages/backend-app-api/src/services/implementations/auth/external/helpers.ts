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
import { AccessRestriptionsMap } from './types';

/**
 * Parses and returns the `accessRestrictions` configuration from an
 * `externalAccess` entry, or undefined if there wasn't one.
 *
 * @internal
 */
export function readAccessRestrictionsFromConfig(
  externalAccessEntryConfig: Config,
): AccessRestriptionsMap | undefined {
  const configs =
    externalAccessEntryConfig.getOptionalConfigArray('accessRestrictions') ??
    [];

  const result: AccessRestriptionsMap = new Map();
  for (const config of configs) {
    const validKeys = ['plugin', 'permission', 'permissionAttribute'];
    for (const key of config.keys()) {
      if (!validKeys.includes(key)) {
        const valid = validKeys.map(k => `'${k}'`).join(', ');
        throw new Error(
          `Invalid key '${key}' in 'accessRestrictions' config, expected one of ${valid}`,
        );
      }
    }

    const pluginId = config.getString('plugin');
    const permissionNames = readPermissionNames(config);
    const permissionAttributes = readPermissionAttributes(config);

    if (result.has(pluginId)) {
      throw new Error(
        `Attempted to declare 'accessRestrictions' twice for plugin '${pluginId}', which is not permitted`,
      );
    }

    result.set(pluginId, {
      ...(permissionNames ? { permissionNames } : {}),
      ...(permissionAttributes ? { permissionAttributes } : {}),
    });
  }

  return result.size ? result : undefined;
}

/**
 * Reads a config value as a string or an array of strings, and deduplicates and
 * splits by comma/space into a string array. Can also validate against a known
 * set of values. Returns undefined if the key didn't exist or if the array
 * would have ended up being empty.
 */
function stringOrStringArray<T extends string>(
  root: Config,
  key: string,
  validValues?: readonly T[],
): T[] | undefined {
  if (!root.has(key)) {
    return undefined;
  }

  const rawValues = Array.isArray(root.get(key))
    ? root.getStringArray(key)
    : [root.getString(key)];

  const values = [
    ...new Set(
      rawValues
        .map(v => v.split(/[ ,]/))
        .flat()
        .filter(Boolean),
    ),
  ];

  if (!values.length) {
    return undefined;
  }

  if (validValues?.length) {
    for (const value of values) {
      if (!validValues.includes(value as T)) {
        const valid = validValues.map(k => `'${k}'`).join(', ');
        throw new Error(
          `Invalid value '${value}' at '${key}' in 'permissionAttributes' config, valid values are ${valid}`,
        );
      }
    }
  }

  return values as T[];
}

function readPermissionNames(externalAccessEntryConfig: Config) {
  return stringOrStringArray(externalAccessEntryConfig, 'permission');
}

function readPermissionAttributes(externalAccessEntryConfig: Config) {
  const config = externalAccessEntryConfig.getOptionalConfig(
    'permissionAttribute',
  );
  if (!config) {
    return undefined;
  }

  const validKeys = ['action'];
  for (const key of config.keys()) {
    if (!validKeys.includes(key)) {
      const valid = validKeys.map(k => `'${k}'`).join(', ');
      throw new Error(
        `Invalid key '${key}' in 'permissionAttribute' config, expected ${valid}`,
      );
    }
  }

  const action = stringOrStringArray(config, 'action', [
    'create',
    'read',
    'update',
    'delete',
  ]);

  const result = {
    ...(action ? { action } : {}),
  };

  return Object.keys(result).length ? result : undefined;
}
