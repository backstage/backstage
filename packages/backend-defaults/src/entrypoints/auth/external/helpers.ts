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
import { AccessRestrictionsMap, ExternalTokenHandler } from './types';

/**
 * Parses and returns the `accessRestrictions` configuration from an
 * `externalAccess` entry, or undefined if there wasn't one.
 *
 * @internal
 */
export function readAccessRestrictionsFromConfig(
  externalAccessEntryConfig: Config,
): AccessRestrictionsMap | undefined {
  const configs =
    externalAccessEntryConfig.getOptionalConfigArray('accessRestrictions') ??
    [];

  const result: AccessRestrictionsMap = new Map();
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
 *
 * @internal
 */
export function readStringOrStringArrayFromConfig<T extends string>(
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
  return readStringOrStringArrayFromConfig(
    externalAccessEntryConfig,
    'permission',
  );
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

  const action = readStringOrStringArrayFromConfig(config, 'action', [
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

/**
 * Creates an external token handler with the provided implementation.
 *
 * This helper function simplifies the creation of external token handlers by
 * providing type safety and a consistent API. External token handlers are used
 * to validate tokens from external systems that need to authenticate with Backstage.
 *
 * See {@link https://backstage.io/docs/auth/service-to-service-auth#adding-custom-externaltokenhandler | the service-to-service auth docs}
 * for more information about implementing custom external token handlers.
 *
 * @public
 * @param handler - The external token handler implementation with type, initialize, and verifyToken methods
 * @returns The same handler instance, typed as ExternalTokenHandler<TContext>
 *
 * @example
 * ```ts
 * const customHandler = createExternalTokenHandler({
 *   type: 'custom',
 *   initialize({ options }) {
 *     return { apiKey: options.getString('apiKey') };
 *   },
 *   async verifyToken(token, context) {
 *     // Custom validation logic here
 *     return { subject: 'custom:user' };
 *   },
 * });
 * ```
 */
export function createExternalTokenHandler<TContext>(
  handler: ExternalTokenHandler<TContext>,
): ExternalTokenHandler<TContext> {
  return handler;
}
