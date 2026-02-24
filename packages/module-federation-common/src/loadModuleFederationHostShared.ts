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

import {
  BACKSTAGE_RUNTIME_SHARED_DEPENDENCIES_GLOBAL,
  LoadedRuntimeSharedDependency,
  RuntimeSharedDependenciesGlobal,
} from './types';
import { ForwardedError } from '@backstage/errors';

/**
 * Preloads and builds the list of shared dependencies provided to the module federation runtime.
 *
 * @public
 */
export async function loadModuleFederationHostShared(options?: {
  onError?: (error: Error) => void;
}): Promise<Record<string, LoadedRuntimeSharedDependency>> {
  const { items = [], version } =
    (
      window as {
        [BACKSTAGE_RUNTIME_SHARED_DEPENDENCIES_GLOBAL]?: RuntimeSharedDependenciesGlobal;
      }
    )[BACKSTAGE_RUNTIME_SHARED_DEPENDENCIES_GLOBAL] ?? {};
  if (version !== 'v1') {
    throw new Error(
      `Unsupported version of the runtime shared dependencies: ${version}`,
    );
  }

  const results = await Promise.allSettled(items.map(item => item.lib()));

  const shared: Record<string, LoadedRuntimeSharedDependency> = {};
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.status === 'fulfilled') {
      const mod = result.value;
      const item = items[i];
      shared[item.name] = {
        version: item.version,
        lib: () => mod,
        shareConfig: item.shareConfig,
      };
    } else {
      const error = new ForwardedError(
        'Failed to preload module federation shared dependency',
        result.reason,
      );
      if (options?.onError) {
        options.onError(error);
      } else {
        throw error;
      }
    }
  }

  return shared;
}
