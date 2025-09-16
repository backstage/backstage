/*
 * Copyright 2025 The Backstage Authors
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

import { ConfiguredSharedDependencies, SharedDependencies } from './types';

/**
 * Merge an initial set of shared dependencies, with an optional set of configured shared dependencies.
 * Configured shared dependencies can be `false`, which means to remove the shared dependency from the initial set.
 * Individual optional fields set to `null` are removed from the initial set.
 *
 * @param sharedDependencies - The initial set of shared dependencies.
 * @param configSharedDependencies - The optional set of configured shared dependencies.
 * @param additionMode - If 'allow-additions', new shared dependencies from the configured shared dependencies will be added. If 'ignore-additions', they will be ignored.
 * @returns The merged set of shared dependencies.
 *
 * @public
 */
export function mergeSharedDependencies<
  Context extends object,
  AdditionalFields extends object = {},
>(
  sharedDependencies: SharedDependencies<Context & AdditionalFields>,
  configSharedDependencies: ConfiguredSharedDependencies<Context> | undefined,
  additionMode: {} extends AdditionalFields
    ? 'allow-additions' // Types equal
    : 'ignore-additions', // Context more specific
): SharedDependencies<Context & AdditionalFields> {
  const toSharedDependency = (
    sharedDependencyConfig: ConfiguredSharedDependencies<Context>[string] &
      object,
  ) =>
    Object.fromEntries(
      Object.entries(sharedDependencyConfig).map(([key, value]) => [
        key,
        value === null ? undefined : value,
      ]),
    ) as SharedDependencies<Context>[string];

  if (!configSharedDependencies) {
    return sharedDependencies;
  }
  const result: SharedDependencies<Context & AdditionalFields> = {};
  for (const [name, sharedDependency] of Object.entries(sharedDependencies)) {
    const sharedDependencyConfig = configSharedDependencies[name];
    // Remove a shared dependency if it is set as `false` in the configured shared dependencies
    if (sharedDependencyConfig === false) {
      // eslint-disable-next-line no-console
      console.info(
        `Removing module federation shared dependency '${name}' as it is not in the configured shared dependencies`,
      );
      continue;
    }
    // Update a shared dependency if any field (apart from module) is different in the configured shared dependencies
    if (
      Object.keys(sharedDependencyConfig ?? {}).some(
        key =>
          (sharedDependency as any)[key] !==
          (sharedDependencyConfig as any)[key],
      )
    ) {
      // eslint-disable-next-line no-console
      console.info(
        `Updating module federation shared dependency '${name}' from the configured shared dependencies`,
      );
      result[name] = {
        ...sharedDependency,
        ...toSharedDependency({ ...sharedDependencyConfig }),
      };
      continue;
    }
    result[name] = sharedDependency;
  }

  for (const [name, sharedDependencyConfig] of Object.entries(
    configSharedDependencies,
  )) {
    if (result[name] !== undefined) {
      continue;
    }
    if (sharedDependencyConfig === false) {
      continue;
    }
    if (additionMode === 'ignore-additions') {
      // eslint-disable-next-line no-console
      console.info(
        `Ignoring new module federation shared dependency '${name}' from the configured shared dependencies`,
      );
      continue;
    }
    // eslint-disable-next-line no-console
    console.info(
      `Adding module federation shared dependency '${name}' from the configured shared dependencies`,
    );
    result[name] = {
      ...toSharedDependency(sharedDependencyConfig),
      // additionMode is 'allow-additions' so we know that AdditionalFields is an empty object.
      ...({} as AdditionalFields),
    };
  }

  return result;
}
