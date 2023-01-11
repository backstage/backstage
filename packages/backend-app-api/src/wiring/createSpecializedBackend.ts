/*
 * Copyright 2022 The Backstage Authors
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

import { coreServices } from '@backstage/backend-plugin-api';
import { BackstageBackend } from './BackstageBackend';
import { Backend, CreateSpecializedBackendOptions } from './types';

/**
 * @public
 */
export function createSpecializedBackend(
  options: CreateSpecializedBackendOptions,
): Backend {
  const services = options.services.map(sf =>
    typeof sf === 'function' ? sf() : sf,
  );

  const exists = new Set<string>();
  const duplicates = new Set<string>();
  for (const { service } of services) {
    if (exists.has(service.id)) {
      duplicates.add(service.id);
    } else {
      exists.add(service.id);
    }
  }
  if (duplicates.size > 0) {
    const ids = Array.from(duplicates).join(', ');
    throw new Error(`Duplicate service implementations provided for ${ids}`);
  }
  if (exists.has(coreServices.pluginMetadata.id)) {
    throw new Error(
      `The ${coreServices.pluginMetadata.id} service cannot be overridden`,
    );
  }

  return new BackstageBackend(services);
}
