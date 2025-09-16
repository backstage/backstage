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

import { Config } from '@backstage/config';
import { ConfiguredSharedDependencies, Host } from './types';

/**
 * The key path to the module federation host shared dependencies configuration in the application config.
 *
 * @public
 */
export const sharedDependenciesConfigKey = [
  'app',
  'moduleFederation',
  'sharedDependencies',
] as const;

/**
 * Returns the shared dependencies optionally configured for the module federation host
 * in the application config.
 * The returned shared dependencies can be used to override default shared dependencies.
 *
 * @param config - The Backstage application config.
 * @returns The shared dependencies configured for the module federation host or an empty object if not configured.
 * @public
 */
export function getConfiguredHostSharedDependencies(
  config: Config,
): ConfiguredSharedDependencies<Host> {
  const parentConfig = config.getOptionalConfig(
    sharedDependenciesConfigKey
      .slice(0, sharedDependenciesConfigKey.length - 1)
      .join('.'),
  );
  if (parentConfig === undefined || parentConfig === null) {
    return {};
  }

  return (config.getOptional(sharedDependenciesConfigKey.join('.')) ??
    {}) as ConfiguredSharedDependencies<Host>;
}
