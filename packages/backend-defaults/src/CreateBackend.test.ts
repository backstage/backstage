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
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { createBackend } from './CreateBackend';

describe('createBackend', () => {
  it('should not throw when overriding a default service implementation', async () => {
    const backend = createBackend();

    backend.add(
      createServiceFactory({
        service: coreServices.rootConfig,
        deps: {},
        factory(): never {
          throw new Error('NOPE');
        },
      }),
    );

    // We expect the service factory error to be thrown, rather than any earlier validation
    await expect(backend.start()).rejects.toThrow('NOPE');
  });

  it('should throw on duplicate service implementations', async () => {
    const backend = createBackend();

    backend.add(
      createServiceFactory({
        service: coreServices.rootLifecycle,
        deps: {},
        factory: async () => ({
          addStartupHook: () => {},
          addBeforeShutdownHook: () => {},
          addShutdownHook: () => {},
        }),
      }),
    );
    backend.add(
      createServiceFactory({
        service: coreServices.rootLifecycle,
        deps: {},
        factory: async () => ({
          addStartupHook: () => {},
          addBeforeShutdownHook: () => {},
          addShutdownHook: () => {},
        }),
      }),
    );

    await expect(backend.start()).rejects.toThrow(
      'Duplicate service implementations provided for core.rootLifecycle',
    );
  });

  it('should throw when providing a plugin metadata service implementation', async () => {
    const backend = createBackend();
    backend.add(
      createServiceFactory({
        service: coreServices.pluginMetadata,
        deps: {},
        factory: () => ({ getId: () => 'test' }),
      }),
    );

    await expect(backend.start()).rejects.toThrow(
      'The core.pluginMetadata service cannot be overridden',
    );
  });
});
