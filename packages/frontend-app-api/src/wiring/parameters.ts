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
import {
  Extension,
  ExtensionInstanceParameters,
} from '@backstage/frontend-plugin-api';

// Since we'll never merge arrays in config the config reader context
// isn't too much of a help. Fall back to manual config reading logic
// as the Config interface makes it quite hard for us otherwise.
/** @internal */
export function readAppExtensionParameters(
  rootConfig: Config,
  resolveExtensionRef: (ref: string) => Extension<unknown> = () => {
    throw new Error('Not Implemented');
  },
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

  const generateIndex = (() => {
    let generatedIndex = 1;
    return () => `generated.${generatedIndex++}`;
  })();

  return arr.map((arrayEntry, index) => {
    function errorMsg(msg: string, key?: string, prop?: string) {
      return `Invalid extension configuration at app.extensions[${index}]${
        key ? `[${key}]` : ''
      }${prop ? `.${prop}` : ''}, ${msg}`;
    }

    // Example YAML:
    //   - entity.card.about
    if (typeof arrayEntry === 'string') {
      return { id: arrayEntry };
    }

    // All other forms are single-key objects
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
    let value = arrayEntry[key];

    let at = key.includes('/') ? key : undefined;
    const id = at ? generateIndex() : key;
    if (typeof value === 'boolean') {
      if (at) {
        throw new Error(
          errorMsg('cannot be applied to an instance input', key),
        );
      }
      value = { disabled: !value };
    } else if (typeof value === 'string') {
      value = { extension: value };
    } else if (
      typeof value !== 'object' ||
      value === null ||
      Array.isArray(value)
    ) {
      throw new Error(errorMsg('must be an object', key));
    }

    const atRef = value.at;
    if (atRef !== undefined && typeof atRef !== 'string') {
      throw new Error(errorMsg('must be a string', key, 'at'));
    } else if (atRef !== undefined) {
      if (at) {
        throw new Error(
          errorMsg(
            `must not specify 'at' when using attachment shorthand form`,
            key,
          ),
        );
      }
      at = atRef;
    }
    const disabled = value.disabled;
    if (disabled !== undefined && typeof disabled !== 'boolean') {
      throw new Error(errorMsg('must be a boolean', key, 'disabled'));
    }
    const extensionRef = value.extension;
    if (extensionRef !== undefined && typeof extensionRef !== 'string') {
      throw new Error(errorMsg('must be a string', key, 'extension'));
    }
    const extension = extensionRef
      ? resolveExtensionRef(extensionRef)
      : undefined;
    return {
      id,
      at,
      disabled,
      extension,
      config: value.config /* validate later */,
    };
  });
}

/** @internal */
export function mergeExtensionParameters(
  base: Partial<ExtensionInstanceParameters>[],
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
