/*
 * Copyright 2023 The Backstage Authors
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
import { Extension } from '@backstage/frontend-plugin-api';
import { JsonValue } from '@backstage/types';

export interface ExtensionParameters {
  id: string;
  at?: string;
  disabled?: boolean;
  config?: unknown;
}

const knownExtensionParameters = ['at', 'disabled', 'config'];

// Since we'll never merge arrays in config the config reader context
// isn't too much of a help. Fall back to manual config reading logic
// as the Config interface makes it quite hard for us otherwise.
/** @internal */
export function readAppExtensionParameters(
  rootConfig: Config,
): ExtensionParameters[] {
  const arr = rootConfig.getOptional('app.extensions');
  if (!Array.isArray(arr)) {
    if (arr === undefined) {
      return [];
    }
    // This will throw, and show which part of config had the wrong type
    rootConfig.getConfigArray('app.extensions');
    return [];
  }

  return arr.map((arrayEntry, arrayIndex) =>
    expandShorthandExtensionParameters(arrayEntry, arrayIndex),
  );
}

/** @internal */
export function expandShorthandExtensionParameters(
  arrayEntry: JsonValue,
  arrayIndex: number,
): ExtensionParameters {
  function errorMsg(msg: string, key?: string, prop?: string) {
    return `Invalid extension configuration at app.extensions[${arrayIndex}]${
      key ? `[${key}]` : ''
    }${prop ? `.${prop}` : ''}, ${msg}`;
  }

  // Example YAML:
  // - entity.card.about
  if (typeof arrayEntry === 'string') {
    if (arrayEntry.includes('/')) {
      const suggestion = arrayEntry.split('/')[0];
      throw new Error(
        errorMsg(
          `cannot target an extension instance input with the string shorthand (key cannot contain slashes; did you mean '${suggestion}'?)`,
        ),
      );
    }
    if (!arrayEntry) {
      throw new Error(errorMsg('string shorthand cannot be the empty string'));
    }
    return {
      id: arrayEntry,
      disabled: false,
    };
  }

  // All remaining cases are single-key objects
  if (
    typeof arrayEntry !== 'object' ||
    arrayEntry === null ||
    Array.isArray(arrayEntry)
  ) {
    throw new Error(errorMsg('must be a string or an object'));
  }
  const keys = Object.keys(arrayEntry);
  if (keys.length !== 1) {
    const joinedKeys = keys.length ? `'${keys.join("', '")}'` : 'none';
    throw new Error(errorMsg(`must have exactly one key, got ${joinedKeys}`));
  }

  const key = String(keys[0]);
  const value = arrayEntry[key];
  if (!key.match(/^[\.a-zA-Z0-9]+$/)) {
    throw new Error(
      errorMsg(`key must only contain letters, numbers and dots, got ${key}`),
    );
  }

  // Example YAML:
  // - catalog.page.cicd: false
  if (typeof value === 'boolean') {
    return {
      id: key,
      disabled: !value,
    };
  }

  // The remaining case is the generic object. Example YAML:
  //  - tech-radar.page:
  //      at: core.router/routes
  //      disabled: false
  //      config:
  //        path: /tech-radar
  //        width: 1500
  //        height: 800
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(errorMsg('value must be a boolean or object', key));
  }

  const at = value.at;
  const disabled = value.disabled;
  const config = value.config;

  if (at !== undefined && typeof at !== 'string') {
    throw new Error(errorMsg('must be a string', key, 'at'));
  } else if (disabled !== undefined && typeof disabled !== 'boolean') {
    throw new Error(errorMsg('must be a boolean', key, 'disabled'));
  } else if (
    config !== undefined &&
    (typeof config !== 'object' || config === null || Array.isArray(config))
  ) {
    throw new Error(errorMsg('must be an object', key, 'config'));
  }

  const unknownKeys = Object.keys(value).filter(
    k => !knownExtensionParameters.includes(k),
  );
  if (unknownKeys.length > 0) {
    throw new Error(
      errorMsg(
        `unknown parameter; expected one of '${knownExtensionParameters.join(
          "', '",
        )}'`,
        key,
        unknownKeys.join(', '),
      ),
    );
  }

  return {
    id: key,
    at,
    disabled,
    config,
  };
}

export interface ExtensionInstanceParameters {
  extension: Extension<unknown>;
  at: string;
  config?: unknown;
}

/** @internal */
export function mergeExtensionParameters(
  base: Extension<unknown>[],
  parameters: Array<ExtensionParameters>,
): ExtensionInstanceParameters[] {
  const overrides = base.map(extension => ({
    extension,
    params: {
      at: extension.at,
      disabled: extension.disabled,
      config: undefined as unknown,
    },
  }));

  for (const overrideParam of parameters) {
    const existingIndex = overrides.findIndex(
      e => e.extension.id === overrideParam.id,
    );
    if (existingIndex !== -1) {
      const existing = overrides[existingIndex];
      if (overrideParam.at) {
        existing.params.at = overrideParam.at;
      }
      if (overrideParam.config) {
        // TODO: merge config?
        existing.params.config = overrideParam.config;
      }
      if (
        Boolean(existing.params.disabled) !== Boolean(overrideParam.disabled)
      ) {
        existing.params.disabled = Boolean(overrideParam.disabled);
        if (!existing.params.disabled) {
          // bump
          overrides.splice(existingIndex, 1);
          overrides.push(existing);
        }
      }
    } else {
      throw new Error(`Extension ${overrideParam.id} does not exist`);
    }
  }

  return overrides
    .filter(override => !override.params.disabled)
    .map(param => ({
      extension: param.extension,
      at: param.params.at,
      config: param.params.config,
    }));
}
