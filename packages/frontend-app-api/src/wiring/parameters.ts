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
import { ExtensionInstanceParameters } from '@backstage/frontend-plugin-api';
import { JsonValue } from '@backstage/types';

const generateExtensionId = (() => {
  let index = 1;
  return () => `generated.${index++}`;
})();

// Since we'll never merge arrays in config the config reader context
// isn't too much of a help. Fall back to manual config reading logic
// as the Config interface makes it quite hard for us otherwise.
/** @internal */
export function readAppExtensionParameters(
  rootConfig: Config,
): Partial<ExtensionInstanceParameters>[] {
  const arr = rootConfig.getOptional('app.extensions');
  if (!Array.isArray(arr)) {
    if (arr === undefined) {
      return [];
    }
    // This will throw, and show which part of config had the wrong type
    rootConfig.getConfigArray('app.extensions');
    return [];
  }

  return arr.map(expandShorthandExtensionParameters);
}

/** @internal */
export function expandShorthandExtensionParameters(
  arrayEntry: JsonValue,
  arrayIndex: number,
): ExtensionInstanceParameters {
  function errorMsg(msg: string, key?: string, prop?: string) {
    return `Invalid extension configuration at app.extensions[${arrayIndex}]${
      key ? `[${key}]` : ''
    }${prop ? `.${prop}` : ''}, ${msg}`;
  }

  // YAML example:
  // - entity.card.about
  if (typeof arrayEntry === 'string') {
    return {
      id: arrayEntry,
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
    const joinedKeys = `"${keys.join('", "')}"`;
    throw new Error(errorMsg(`must have exactly one key, got ${joinedKeys}`));
  }

  const key = keys[0];
  const value = arrayEntry[key];

  // YAML example:
  // - catalog.page.cicd: false
  if (typeof value === 'boolean') {
    if (key.includes('/')) {
      const suggestion = key.split('/')[0];
      throw new Error(
        errorMsg(
          `cannot target an extension instance input (key cannot contain slashes; did you mean '${suggestion}'?)`,
          key,
        ),
      );
    }
    return {
      id: key,
      disabled: !value,
    };
  }

  // All remaining cases have object-shaped values
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(errorMsg('must be an object', key));
  }

  // YAML examples:
  // - tech-radar.page:
  //     at: core.router/routes
  //     extension: '@backstage/plugin-tech-radar#TechRadarPage'
  //     config:
  //       path: /tech-radar
  //       width: 1500
  //       height: 800
  // - core.router/routes:
  //     id: tech-radar.page
  //     extension: '@backstage/plugin-tech-radar#TechRadarPage'
  //     config:
  //       path: /tech-radar
  //       width: 1500
  //       height: 800
  const { id, at, disabled, extension, config, ...unknownProperties } = value;
  if (id !== undefined && typeof id !== 'string') {
    throw new Error(errorMsg('must be a string', key, 'id'));
  } else if (at !== undefined && typeof at !== 'string') {
    throw new Error(errorMsg('must be a string', key, 'at'));
  } else if (disabled !== undefined && typeof disabled !== 'boolean') {
    throw new Error(errorMsg('must be a boolean', key, 'disabled'));
  } else if (extension !== undefined && typeof extension !== 'string') {
    throw new Error(errorMsg('must be a string', key, 'extension'));
  } else if (extension) {
    throw new Error('TODO: implement extension resolution');
  } else if (
    config !== undefined &&
    (typeof config !== 'object' || config === null || Array.isArray(config))
  ) {
    throw new Error(errorMsg('must be an object', key, 'config'));
  } else if (Object.entries(unknownProperties).length) {
    throw new Error(
      errorMsg(
        'is an unknown property',
        key,
        Object.keys(unknownProperties)[0],
      ),
    );
  }

  return {
    id: key,
    at,
    disabled,
    config: value.config /* validate later */,
  };
}

/** @internal */
export function mergeExtensionParameters(
  base: ExtensionInstanceParameters[],
  overrides: Array<Partial<ExtensionInstanceParameters>>,
): ExtensionInstanceParameters[] {
  const extensionInstanceParams = base.slice();

  for (const overrideParam of overrides) {
    const existingParamIndex = extensionInstanceParams.findIndex(
      e => e.id === overrideParam.id,
    );
    if (existingParamIndex !== -1) {
      const existingParam = extensionInstanceParams[existingParamIndex];
      if (overrideParam.at) {
        existingParam.at = overrideParam.at;
      }
      if (overrideParam.extension) {
        // TODO: do we want to reset config here? it might be completely
        // unrelated to the previous one
        existingParam.extension = overrideParam.extension;
      }
      if (overrideParam.config) {
        // TODO: merge config?
        existingParam.config = overrideParam.config;
      }
      if (Boolean(existingParam.disabled) !== Boolean(overrideParam.disabled)) {
        existingParam.disabled = Boolean(overrideParam.disabled);
        if (!existingParam.disabled) {
          // bump
          extensionInstanceParams.splice(existingParamIndex, 1);
          extensionInstanceParams.push(existingParam);
        }
      }
    } else if (overrideParam.id) {
      const { id, at, extension, config } = overrideParam;
      if (!at || !extension) {
        throw new Error(`Extension ${overrideParam.id} is incomplete`);
      }
      extensionInstanceParams.push({ id, at, extension, config });
    }
  }

  return extensionInstanceParams.filter(param => !param.disabled);
}
