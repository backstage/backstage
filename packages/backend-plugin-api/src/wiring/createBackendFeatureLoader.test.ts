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

import { coreServices, createServiceFactory } from '../services';
import { InternalServiceFactory } from '../services/system/types';
import { BackendFeature } from '../types';
import { createBackendFeatureLoader } from './createBackendFeatureLoader';
import { createBackendPlugin } from './createBackendPlugin';
import { InternalBackendFeatureLoader } from './types';

describe('createBackendFeatureLoader', () => {
  it('should create an empty feature loader', () => {
    const result = createBackendFeatureLoader({
      deps: {},
      loader: () => [],
    }) as InternalBackendFeatureLoader;

    expect(result.$$type).toEqual('@backstage/BackendFeature');
    expect(result.version).toEqual('v1');
    expect(result.featureType).toEqual('loader');
    expect(result.deps).toEqual({});
    expect(result.loader).toEqual(expect.any(Function));
    expect(result.description).toMatch(/^created at '.*'$/);
  });

  it('should create a feature loader that loads a few features', async () => {
    const result = createBackendFeatureLoader({
      deps: {
        config: coreServices.rootConfig,
      },
      loader({ config: _unused }) {
        return [
          createBackendPlugin({
            pluginId: 'x',
            register() {},
          }),
          createServiceFactory({
            service: coreServices.pluginMetadata,
            deps: {},
            factory: () => ({ getId: () => 'fake-id' }),
          }),
          // Dynamic import format
          Promise.resolve({
            default: createBackendPlugin({
              pluginId: 'y',
              register() {},
            }),
          }),
        ];
      },
    }) as InternalBackendFeatureLoader;

    expect(result.$$type).toEqual('@backstage/BackendFeature');
    expect(result.version).toEqual('v1');
    expect(result.featureType).toEqual('loader');

    const results = await result.loader({ config: {} });
    expect(results.length).toBe(3);
    const [pluginX, serviceFactory, pluginY] = results;
    expect(pluginX.$$type).toBe('@backstage/BackendFeature');
    expect(serviceFactory.$$type).toBe('@backstage/BackendFeature');
    expect(pluginY.$$type).toBe('@backstage/BackendFeature');
    expect((serviceFactory as InternalServiceFactory).service.id).toBe(
      coreServices.pluginMetadata.id,
    );
  });

  it('should support multiple output formats', async () => {
    const feature = createBackendPlugin({ pluginId: 'x', register() {} });
    const dynamicFeature = Promise.resolve({ default: feature });

    async function extractResult(f: BackendFeature) {
      const internal = f as InternalBackendFeatureLoader;
      return internal.loader({});
    }

    await expect(
      extractResult(
        createBackendFeatureLoader({
          loader() {
            return [feature];
          },
        }),
      ),
    ).resolves.toEqual([feature]);

    await expect(
      extractResult(
        createBackendFeatureLoader({
          async loader() {
            return [feature];
          },
        }),
      ),
    ).resolves.toEqual([feature]);

    await expect(
      extractResult(
        createBackendFeatureLoader({
          *loader() {
            yield feature;
          },
        }),
      ),
    ).resolves.toEqual([feature]);

    await expect(
      extractResult(
        createBackendFeatureLoader({
          async *loader() {
            yield feature;
          },
        }),
      ),
    ).resolves.toEqual([feature]);

    await expect(
      extractResult(
        createBackendFeatureLoader({
          loader() {
            return [dynamicFeature];
          },
        }),
      ),
    ).resolves.toEqual([feature]);

    await expect(
      extractResult(
        createBackendFeatureLoader({
          async loader() {
            return [dynamicFeature];
          },
        }),
      ),
    ).resolves.toEqual([feature]);

    await expect(
      extractResult(
        createBackendFeatureLoader({
          *loader() {
            yield dynamicFeature;
          },
        }),
      ),
    ).resolves.toEqual([feature]);

    await expect(
      extractResult(
        createBackendFeatureLoader({
          async *loader() {
            yield dynamicFeature;
          },
        }),
      ),
    ).resolves.toEqual([feature]);
  });

  it('should only allow dependencies on root scoped services', () => {
    createBackendFeatureLoader({
      deps: {
        rootLogger: coreServices.rootLogger,
      },
      loader: () => [],
    });
    createBackendFeatureLoader({
      deps: {
        // @ts-expect-error
        logger: coreServices.logger,
      },
      loader: () => [],
    });
    createBackendFeatureLoader({
      deps: {
        rootLogger: coreServices.rootLogger,
        // @ts-expect-error
        logger: coreServices.logger,
      },
      loader: () => [],
    });
    expect('test').toBe('test');
  });
});
