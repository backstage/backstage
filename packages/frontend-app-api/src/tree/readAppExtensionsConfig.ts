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
import { JsonValue } from '@backstage/types';

import { ErrorCollector } from '../wiring/createErrorCollector';

export interface ExtensionInputSettings {
  [inputName: string]: { order?: string[] };
}

export interface ExtensionParameters {
  id: string;
  attachTo?: { id: string; input: string };
  disabled?: boolean;
  config?: unknown;
  inputs?: ExtensionInputSettings;
}

const knownExtensionParameters = ['attachTo', 'disabled', 'config', 'inputs'];

/** @internal */
export function readAppExtensionsConfig(
  rootConfig: Config,
  collector: ErrorCollector,
): {
  parameters: ExtensionParameters[];
  reorder: boolean;
} {
  let value: JsonValue | undefined;
  try {
    value = rootConfig.getOptional('app.extensions');
  } catch (error) {
    collector.report({
      code: 'EXTENSION_CONFIG_INVALID',
      message: String(error),
      context: { configPath: 'app.extensions' },
    });
    return { parameters: [], reorder: false };
  }
  const reorder = Array.isArray(value);
  const parameters: ExtensionParameters[] = [];
  if (value === undefined) return { parameters, reorder };
  if (typeof value !== 'object' || value === null) {
    collector.report({
      code: 'EXTENSION_CONFIG_INVALID',
      message:
        'Invalid extension configuration at app.extensions, must be an array or object',
      context: { configPath: 'app.extensions' },
    });
    return { parameters, reorder };
  }
  const entries = Array.isArray(value)
    ? value.map((entry, index) => ({ entry, path: index }))
    : Object.entries(value).map(([id, settings]) => ({
        entry: { [id]: settings },
        path: 'app.extensions',
      }));
  for (const { entry, path } of entries) {
    let extensionId: string | undefined;
    if (typeof entry === 'string') extensionId = entry;
    else if (entry && typeof entry === 'object' && !Array.isArray(entry))
      extensionId = Object.keys(entry)[0];
    const report = (message: string) =>
      collector.report({
        code: 'EXTENSION_CONFIG_INVALID',
        message,
        context: {
          configPath:
            typeof path === 'number' ? `app.extensions[${path}]` : path,
          extensionId,
        },
      });
    try {
      parameters.push(expandShorthandExtensionParameters(entry, path, report));
    } catch (error) {
      report(error instanceof Error ? error.message : String(error));
    }
  }
  return { parameters, reorder };
}

/** @internal */
export function expandShorthandExtensionParameters(
  arrayEntry: JsonValue,
  configPath: number | string,
  reportError: (message: string) => void = message => {
    throw new Error(message);
  },
): ExtensionParameters {
  function errorMsg(msg: string, key?: string, prop?: string) {
    return `Invalid extension configuration at ${
      typeof configPath === 'number'
        ? `app.extensions[${configPath}]`
        : configPath
    }${key ? `[${key}]` : ''}${prop ? `.${prop}` : ''}, ${msg}`;
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

  // Environment variable substitution always produces a string, so boolean-ish
  // strings need to be coerced too. Example YAML:
  // - catalog.page.cicd: ${CATALOG_PAGE_CICD_ENABLED}
  if (value === 'true' || value === 'false') {
    return {
      id,
      disabled: value === 'false',
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
    throw new Error(
      errorMsg("value must be a boolean, 'true', 'false', or object", id),
    );
  }

  const attachTo = value.attachTo as { id: string; input: string } | undefined;
  let disabled = value.disabled;
  const config = value.config;

  if (attachTo !== undefined) {
    if (
      attachTo === null ||
      typeof attachTo !== 'object' ||
      Array.isArray(attachTo)
    ) {
      throw new Error(errorMsg('must be an object', id, 'attachTo'));
    }
    if (typeof attachTo.id !== 'string' || attachTo.id === '') {
      throw new Error(
        errorMsg('must be a non-empty string', id, 'attachTo.id'),
      );
    }
    if (typeof attachTo.input !== 'string' || attachTo.input === '') {
      throw new Error(
        errorMsg('must be a non-empty string', id, 'attachTo.input'),
      );
    }
  }
  if (disabled !== undefined && typeof disabled !== 'boolean') {
    // Environment variable substitution always produces a string, e.g.
    // disabled: ${CATALOG_OVERVIEW_DISABLED}
    if (disabled === 'true' || disabled === 'false') {
      disabled = disabled === 'true';
    } else {
      throw new Error(
        errorMsg("must be a boolean, 'true', or 'false'", id, 'disabled'),
      );
    }
  }
  if (
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

  let inputs: ExtensionParameters['inputs'];
  if (value.inputs !== undefined) {
    if (
      !value.inputs ||
      typeof value.inputs !== 'object' ||
      Array.isArray(value.inputs)
    ) {
      reportError(errorMsg('must be an object', id, 'inputs'));
    } else {
      inputs = {};
      for (const [inputName, settings] of Object.entries(value.inputs)) {
        const prop = `inputs.${inputName}`;
        if (
          !settings ||
          typeof settings !== 'object' ||
          Array.isArray(settings)
        ) {
          reportError(errorMsg('must be an object', id, prop));
          continue;
        }
        Object.defineProperty(inputs, inputName, {
          value: {},
          enumerable: true,
          writable: true,
        });
        for (const key of Object.keys(settings)) {
          if (key !== 'order')
            reportError(
              errorMsg(
                "unknown parameter; expected 'order'",
                id,
                `${prop}.${key}`,
              ),
            );
        }
        if (settings.order === undefined) continue;
        if (!Array.isArray(settings.order)) {
          reportError(
            errorMsg('must be an array of extension IDs', id, `${prop}.order`),
          );
          continue;
        }
        const seen = new Set<string>();
        const order: string[] = [];
        for (const entry of settings.order) {
          if (typeof entry !== 'string' || !entry || entry !== entry.trim()) {
            reportError(
              errorMsg(
                'must be a non-empty extension ID or wildcard',
                id,
                `${prop}.order`,
              ),
            );
          } else if (seen.has(entry)) {
            reportError(
              errorMsg(
                `duplicate entry '${entry}'; keeping the first occurrence`,
                id,
                `${prop}.order`,
              ),
            );
          } else {
            seen.add(entry);
            order.push(entry);
          }
        }
        inputs[inputName] = { order };
      }
    }
  }
  return {
    id,
    attachTo,
    disabled,
    config,
    ...(inputs ? { inputs } : {}),
  };
}
