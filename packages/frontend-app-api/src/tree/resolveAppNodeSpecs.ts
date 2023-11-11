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

import {
  BackstagePlugin,
  Extension,
  ExtensionOverrides,
} from '@backstage/frontend-plugin-api';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalExtensionOverrides } from '../../../frontend-plugin-api/src/wiring/createExtensionOverrides';
import { ExtensionParameters } from './readAppExtensionsConfig';
import { AppNodeSpec } from '@backstage/frontend-plugin-api';

/** @internal */
export function resolveAppNodeSpecs(options: {
  features: (BackstagePlugin | ExtensionOverrides)[];
  builtinExtensions: Extension<unknown>[];
  parameters: Array<ExtensionParameters>;
  forbidden?: Set<string>;
}): AppNodeSpec[] {
  const { builtinExtensions, parameters, forbidden = new Set() } = options;

  const plugins = options.features.filter(
    (f): f is BackstagePlugin => f.$$type === '@backstage/BackstagePlugin',
  );
  const overrides = options.features.filter(
    (f): f is ExtensionOverrides =>
      f.$$type === '@backstage/ExtensionOverrides',
  );

  const pluginExtensions = plugins.flatMap(source => {
    return source.extensions.map(extension => ({ ...extension, source }));
  });
  const overrideExtensions = overrides.flatMap(
    override => toInternalExtensionOverrides(override).extensions,
  );

  // Prevent core override
  if (pluginExtensions.some(({ id }) => forbidden.has(id))) {
    const pluginsStr = pluginExtensions
      .filter(({ id }) => forbidden.has(id))
      .map(({ source }) => `'${source.id}'`)
      .join(', ');
    const forbiddenStr = [...forbidden].map(id => `'${id}'`).join(', ');
    throw new Error(
      `It is forbidden to override the following extension(s): ${forbiddenStr}, which is done by the following plugin(s): ${pluginsStr}`,
    );
  }

  if (overrideExtensions.some(({ id }) => forbidden.has(id))) {
    const forbiddenStr = [...forbidden].map(id => `'${id}'`).join(', ');
    throw new Error(
      `It is forbidden to override the following extension(s): ${forbiddenStr}, which is done by one or more extension overrides`,
    );
  }
  const overrideExtensionIds = overrideExtensions.map(({ id }) => id);
  if (overrideExtensionIds.length !== new Set(overrideExtensionIds).size) {
    const counts = new Map<string, number>();
    for (const id of overrideExtensionIds) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
    const duplicated = Array.from(counts.entries())
      .filter(([, count]) => count > 1)
      .map(([id]) => id);
    throw new Error(
      `The following extensions had duplicate overrides: ${duplicated.join(
        ', ',
      )}`,
    );
  }

  const configuredExtensions = [
    ...pluginExtensions.map(({ source, ...extension }) => ({
      extension,
      params: {
        source,
        attachTo: extension.attachTo,
        disabled: extension.disabled,
        config: undefined as unknown,
      },
    })),
    ...builtinExtensions.map(extension => ({
      extension,
      params: {
        source: undefined,
        attachTo: extension.attachTo,
        disabled: extension.disabled,
        config: undefined as unknown,
      },
    })),
  ];

  // Install all extension overrides
  for (const extension of overrideExtensions) {
    // Check if our override is overriding an extension that already exists
    const index = configuredExtensions.findIndex(
      e => e.extension.id === extension.id,
    );
    if (index !== -1) {
      // Only implementation, attachment point and default disabled status are overridden, the source is kept
      configuredExtensions[index].extension = extension;
      configuredExtensions[index].params.attachTo = extension.attachTo;
      configuredExtensions[index].params.disabled = extension.disabled;
    } else {
      // Add the extension as a new one when not overriding an existing one
      configuredExtensions.push({
        extension,
        params: {
          source: undefined,
          attachTo: extension.attachTo,
          disabled: extension.disabled,
          config: undefined,
        },
      });
    }
  }

  const duplicatedExtensionIds = new Set<string>();
  const duplicatedExtensionData = configuredExtensions.reduce<
    Record<string, Record<string, number>>
  >((data, { extension, params }) => {
    const extensionId = extension.id;
    const extensionData = data?.[extensionId];
    if (extensionData) duplicatedExtensionIds.add(extensionId);
    const pluginId = params.source?.id ?? 'internal';
    const pluginCount = extensionData?.[pluginId] ?? 0;
    return {
      ...data,
      [extensionId]: { ...extensionData, [pluginId]: pluginCount + 1 },
    };
  }, {});

  if (duplicatedExtensionIds.size > 0) {
    throw new Error(
      `The following extensions are duplicated: ${Array.from(
        duplicatedExtensionIds,
      )
        .map(
          extensionId =>
            `The extension '${extensionId}' was provided ${Object.keys(
              duplicatedExtensionData[extensionId],
            )
              .map(
                pluginId =>
                  `${duplicatedExtensionData[extensionId][pluginId]} time(s) by the plugin '${pluginId}'`,
              )
              .join(' and ')}`,
        )
        .join(', ')}`,
    );
  }

  for (const overrideParam of parameters) {
    const extensionId = overrideParam.id;

    if (forbidden.has(extensionId)) {
      throw new Error(
        `Configuration of the '${extensionId}' extension is forbidden`,
      );
    }

    const existingIndex = configuredExtensions.findIndex(
      e => e.extension.id === extensionId,
    );
    if (existingIndex !== -1) {
      const existing = configuredExtensions[existingIndex];
      if (overrideParam.attachTo) {
        existing.params.attachTo = overrideParam.attachTo;
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
          configuredExtensions.splice(existingIndex, 1);
          configuredExtensions.push(existing);
        }
      }
    } else {
      throw new Error(`Extension ${extensionId} does not exist`);
    }
  }

  return configuredExtensions.map(param => ({
    id: param.extension.id,
    attachTo: param.params.attachTo,
    extension: param.extension,
    disabled: param.params.disabled,
    source: param.params.source,
    config: param.params.config,
  }));
}
