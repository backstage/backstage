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
import { metricsServiceFactory } from './metricsServiceFactory';
import { DefaultMetricsService } from './DefaultMetricsService';

describe('metricsServiceFactory', () => {
  let createSpy: jest.SpyInstance;

  beforeEach(() => {
    createSpy = jest.spyOn(DefaultMetricsService, 'create');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const defaultServices = [
    mockServices.rootConfig.factory(),
    metricsServiceFactory,
  ];

  it('should use backstage-plugin-{pluginId} as meter name when no config is set', async () => {
    await ServiceFactoryTester.from(metricsServiceFactory, {
      dependencies: defaultServices,
    }).getSubject('my-plugin');

    expect(createSpy).toHaveBeenCalledWith({
      name: 'backstage-plugin-my-plugin',
      version: undefined,
      schemaUrl: undefined,
    });
  });

  it('should use custom name from config', async () => {
    await ServiceFactoryTester.from(metricsServiceFactory, {
      dependencies: [
        mockServices.rootConfig.factory({
          data: {
            backend: {
              metrics: {
                plugin: {
                  'my-plugin': {
                    meter: {
                      name: 'custom-metrics-name',
                    },
                  },
                },
              },
            },
          },
        }),
        metricsServiceFactory,
      ],
    }).getSubject('my-plugin');

    expect(createSpy).toHaveBeenCalledWith({
      name: 'custom-metrics-name',
      version: undefined,
      schemaUrl: undefined,
    });
  });

  it('should accept version and schemaUrl from config', async () => {
    await ServiceFactoryTester.from(metricsServiceFactory, {
      dependencies: [
        mockServices.rootConfig.factory({
          data: {
            backend: {
              metrics: {
                plugin: {
                  'my-plugin': {
                    meter: {
                      name: 'my-plugin-metrics',
                      version: '1.2.3',
                      schemaUrl: 'https://example.com/schema',
                    },
                  },
                },
              },
            },
          },
        }),
        metricsServiceFactory,
      ],
    }).getSubject('my-plugin');

    expect(createSpy).toHaveBeenCalledWith({
      name: 'my-plugin-metrics',
      version: '1.2.3',
      schemaUrl: 'https://example.com/schema',
    });
  });

  it('should implement the full MetricsService interface', async () => {
    const subject = await ServiceFactoryTester.from(metricsServiceFactory, {
      dependencies: defaultServices,
    }).getSubject('test-plugin');

    expect(createSpy).toHaveBeenCalledWith({
      name: 'backstage-plugin-test-plugin',
      version: undefined,
      schemaUrl: undefined,
    });

    expect(subject.createCounter).toBeDefined();
    expect(subject.createUpDownCounter).toBeDefined();
    expect(subject.createHistogram).toBeDefined();
    expect(subject.createGauge).toBeDefined();
    expect(subject.createObservableCounter).toBeDefined();
    expect(subject.createObservableUpDownCounter).toBeDefined();
    expect(subject.createObservableGauge).toBeDefined();
  });
});
