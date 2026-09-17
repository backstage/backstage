/*
 * Copyright 2026 The Backstage Authors
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
  mockServices,
  ServiceFactoryTester,
} from '@backstage/backend-test-utils';
import { tracingServiceFactory } from './tracingServiceFactory';
import { DefaultTracingService } from './DefaultTracingService';

describe('tracingServiceFactory', () => {
  let createSpy: jest.SpyInstance;

  beforeEach(() => {
    createSpy = jest.spyOn(DefaultTracingService, 'create');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const defaultDeps = [
    mockServices.rootConfig.factory(),
    mockServices.httpAuth.factory(),
    tracingServiceFactory,
  ];

  it('uses backstage-plugin-{pluginId} as the tracer name when no config is set', async () => {
    await ServiceFactoryTester.from(tracingServiceFactory, {
      dependencies: defaultDeps,
    }).getSubject('my-plugin');

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'backstage-plugin-my-plugin',
        version: undefined,
        schemaUrl: undefined,
        pluginId: 'my-plugin',
        captureEndUser: false,
      }),
    );
  });

  it('uses a custom tracer name from config', async () => {
    await ServiceFactoryTester.from(tracingServiceFactory, {
      dependencies: [
        mockServices.rootConfig.factory({
          data: {
            backend: {
              tracing: {
                plugin: {
                  'my-plugin': {
                    tracer: { name: 'custom-tracer-name' },
                  },
                },
              },
            },
          },
        }),
        mockServices.httpAuth.factory(),
        tracingServiceFactory,
      ],
    }).getSubject('my-plugin');

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'custom-tracer-name',
      }),
    );
  });

  it('accepts version and schemaUrl from config', async () => {
    await ServiceFactoryTester.from(tracingServiceFactory, {
      dependencies: [
        mockServices.rootConfig.factory({
          data: {
            backend: {
              tracing: {
                plugin: {
                  'my-plugin': {
                    tracer: {
                      name: 'my-plugin-tracer',
                      version: '1.2.3',
                      schemaUrl: 'https://example.com/schema',
                    },
                  },
                },
              },
            },
          },
        }),
        mockServices.httpAuth.factory(),
        tracingServiceFactory,
      ],
    }).getSubject('my-plugin');

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'my-plugin-tracer',
        version: '1.2.3',
        schemaUrl: 'https://example.com/schema',
      }),
    );
  });

  it('reads backend.tracing.capture.endUser into the service', async () => {
    await ServiceFactoryTester.from(tracingServiceFactory, {
      dependencies: [
        mockServices.rootConfig.factory({
          data: { backend: { tracing: { capture: { endUser: true } } } },
        }),
        mockServices.httpAuth.factory(),
        tracingServiceFactory,
      ],
    }).getSubject('my-plugin');

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({ captureEndUser: true }),
    );
  });
});
