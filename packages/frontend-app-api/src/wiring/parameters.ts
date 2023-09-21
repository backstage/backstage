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
import { BackstagePlugin, Extension } from '@backstage/frontend-plugin-api';
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

  // NOTE(freben): This check is intentionally not complete and doesn't check
  // whether letters and digits are used, etc. It's not up to the config reading
  // logic to decide what constitutes a valid extension ID; that should be
  // decided by the logic that loads and instantiates the extensions. This check
  // is just here to catch real mistakes or truly conceptually wrong input.
  function assertValidId(id: string) {
    if (!id || id !== id.trim()) {
      throw new Error(
        errorMsg('extension ID must not be empty or contain whitespace'),
      );
    }

    if (id.includes('/')) {
      let message = `extension ID must not contain slashes; got '${id}'`;
      const good = id.split('/')[0];
      if (good) {
        message += `, did you mean '${good}'?`;
      }
      throw new Error(errorMsg(message));
    }
  }

  // Example YAML:
  // - entity.card.about
  if (typeof arrayEntry === 'string') {
    assertValidId(arrayEntry);
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

  const id = String(keys[0]);
  const value = arrayEntry[id];
  assertValidId(id);

  // This example covers a potentially common mistake in the syntax
  // Example YAML:
  // - entity.card.about:
  if (value === null) {
    return {
      id,
      disabled: false,
    };
  }

  // Example YAML:
  // - catalog.page.cicd: false
  if (typeof value === 'boolean') {
    return {
      id,
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
  if (typeof value !== 'object' || Array.isArray(value)) {
    // We don't mention null here - we don't want people to explicitly enter
    // - entity.card.about: null
    throw new Error(errorMsg('value must be a boolean or object', id));
  }

  const at = value.at;
  const disabled = value.disabled;
  const config = value.config;

  if (at !== undefined && typeof at !== 'string') {
    throw new Error(errorMsg('must be a string', id, 'at'));
  } else if (disabled !== undefined && typeof disabled !== 'boolean') {
    throw new Error(errorMsg('must be a boolean', id, 'disabled'));
  } else if (
    config !== undefined &&
    (typeof config !== 'object' || config === null || Array.isArray(config))
  ) {
    throw new Error(errorMsg('must be an object', id, 'config'));
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
        id,
        unknownKeys.join(', '),
      ),
    );
  }

  return {
    id,
    at,
    disabled,
    config,
  };
}

export interface ExtensionInstanceParameters {
  extension: Extension<unknown>;
  source?: BackstagePlugin;
  at: string;
  config?: unknown;
}

/** @internal */
export function mergeExtensionParameters(options: {
  sources: BackstagePlugin[];
  builtinExtensions: Extension<unknown>[];
  parameters: Array<ExtensionParameters>;
}): ExtensionInstanceParameters[] {
  const { sources, builtinExtensions, parameters } = options;

  const pluginExtensions = sources.flatMap(source =>
    source.extensions.map(extension => ({ ...extension, source })),
  );

  // Prevent root override
  if (pluginExtensions.some(({ id }) => id === 'root')) {
    const rootPluginIds = pluginExtensions
      .filter(({ id }) => id === 'root')
      .map(({ source }) => source.id);
    throw new Error(
      `The following plugin(s) are overriding the 'root' extension which is forbidden: ${rootPluginIds.join(
        ',',
      )}`,
    );
  }

  const overrides = [
    ...pluginExtensions.map(({ source, ...extension }) => ({
      extension,
      params: {
        source,
        at: extension.at,
        disabled: extension.disabled,
        config: undefined as unknown,
      },
    })),
    ...builtinExtensions.map(extension => ({
      extension,
      params: {
        source: undefined,
        at: extension.at,
        disabled: extension.disabled,
        config: undefined as unknown,
      },
    })),
  ];

  for (const overrideParam of parameters) {
    const extensionId = overrideParam.id;

    // Prevent root parametrization
    if (extensionId === 'root') {
      throw new Error(
        "A 'root' extension configuration was detected, but the root extension is not configurable",
      );
    }

    const existingIndex = overrides.findIndex(
      e => e.extension.id === extensionId,
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
      throw new Error(`Extension ${extensionId} does not exist`);
    }
  }

  return overrides
    .filter(override => !override.params.disabled)
    .map(param => ({
      extension: param.extension,
      at: param.params.at,
      source: param.params.source,
      config: param.params.config,
    }));
}
