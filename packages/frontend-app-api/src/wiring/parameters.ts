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
import { JsonValue } from '@backstage/types';
import omitBy from 'lodash/omitBy';

const knownExtensionInstanceParameters = [
  'at',
  'disabled',
  'extension',
  'config',
];

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

  const generateExtensionId = (() => {
    let index = 1;
    return () => `generated.${index++}`;
  })();

  return arr.map((arrayEntry, arrayIndex) =>
    expandShorthandExtensionParameters(
      arrayEntry,
      arrayIndex,
      resolveExtensionRef,
      generateExtensionId,
    ),
  );
}

/** @internal */
export function expandShorthandExtensionParameters(
  arrayEntry: JsonValue,
  arrayIndex: number,
  resolveExtensionRef: (ref: string) => Extension<unknown>,
  generateExtensionId: () => string,
): Partial<ExtensionInstanceParameters> {
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

  const key = keys[0];
  const value = arrayEntry[key];

  // Example YAML:
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

  // Example YAML:
  // - core.router/routes: '@backstage/plugin-some-plugin#MyPage'
  // - some-plugin.page: '@internal/frontend-customizations#MyModifiedPage'
  if (typeof value === 'string') {
    if (key.includes('/')) {
      return {
        id: generateExtensionId(),
        at: key,
        extension: resolveExtensionRef(value),
      };
    }

    return {
      id: key,
      extension: resolveExtensionRef(value),
    };
  }

  // The remaining case is the generic object. Example YAML:
  // - core.router/routes:
  //     extension: '@backstage/core-app-api#Redirect'
  //     config:
  //       path: /
  //       to: /catalog
  //  - tech-radar.page:
  //      at: core.router/routes
  //      extension: '@backstage/plugin-tech-radar#TechRadarPage'
  //      config:
  //        path: /tech-radar
  //        width: 1500
  //        height: 800
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(
      errorMsg('value must be a boolean, string, or object', key),
    );
  }

  let id = value.id;
  let at = value.at;
  const disabled = value.disabled;
  const extensionRef = value.extension;
  const config = value.config;

  if (key.includes('/')) {
    if (at !== undefined) {
      throw new Error(
        errorMsg(
          `must not redundantly specify 'at' when the extension input ID form of the key is used (with a slash); the 'at' is already implicitly '${key}'`,
          key,
        ),
      );
    }
    if (id !== undefined) {
      throw new Error(
        errorMsg(
          `must not specify 'id' when the extension input ID form of the key is used (with a slash); please replace the key '${key}' with the id instead, and put that key in the 'at' field`,
          key,
          'id',
        ),
      );
    }
    id = generateExtensionId();
    at = key;
  } else {
    if (id !== undefined) {
      throw new Error(
        errorMsg(
          `must not redundantly specify 'id' when the extension instance ID form of the key is used (without a slash); the 'id' is already implicitly '${key}'`,
          key,
        ),
      );
    }
    id = key;
  }

  if (id !== undefined && typeof id !== 'string') {
    throw new Error(errorMsg('must be a string', key, 'id'));
  } else if (at !== undefined && typeof at !== 'string') {
    throw new Error(errorMsg('must be a string', key, 'at'));
  } else if (disabled !== undefined && typeof disabled !== 'boolean') {
    throw new Error(errorMsg('must be a boolean', key, 'disabled'));
  } else if (extensionRef !== undefined && typeof extensionRef !== 'string') {
    throw new Error(errorMsg('must be a string', key, 'extension'));
  } else if (
    config !== undefined &&
    (typeof config !== 'object' || config === null || Array.isArray(config))
  ) {
    throw new Error(errorMsg('must be an object', key, 'config'));
  }

  const unknownKeys = Object.keys(value).filter(
    k => !knownExtensionInstanceParameters.includes(k),
  );
  if (unknownKeys.length > 0) {
    throw new Error(
      errorMsg(
        `unknown parameter; expected one of '${knownExtensionInstanceParameters.join(
          "', '",
        )}'`,
        key,
        unknownKeys.join(', '),
      ),
    );
  }

  const extension: Extension<unknown> | undefined = extensionRef
    ? resolveExtensionRef(extensionRef)
    : undefined;

  return omitBy(
    {
      id,
      at,
      disabled,
      extension,
      config,
    },
    v => v === undefined,
  );
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
