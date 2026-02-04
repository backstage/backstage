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

describe('metricsServiceFactory', () => {
  const defaultServices = [
    mockServices.rootConfig.factory(),
    metricsServiceFactory,
  ];

  describe('factory', () => {
    it('should create a metrics service with plugin id as name when no config is set', async () => {
      const subject = await ServiceFactoryTester.from(metricsServiceFactory, {
        dependencies: defaultServices,
      }).getSubject('my-plugin');

      expect(subject).toBeDefined();
      expect(typeof subject.createCounter).toBe('function');
      expect(typeof subject.createHistogram).toBe('function');
      expect(typeof subject.createGauge).toBe('function');
    });

    it('should create a metrics service with custom name from config', async () => {
      const subject = await ServiceFactoryTester.from(metricsServiceFactory, {
        dependencies: [
          mockServices.rootConfig.factory({
            data: {
              'my-plugin': {
                metrics: {
                  name: 'custom-metrics-name',
                },
              },
            },
          }),
          metricsServiceFactory,
        ],
      }).getSubject('my-plugin');

      expect(subject).toBeDefined();
      const counter = subject.createCounter('test_counter');
      expect(counter).toBeDefined();
    });

    it('should create a metrics service with version and schemaUrl from config', async () => {
      const subject = await ServiceFactoryTester.from(metricsServiceFactory, {
        dependencies: [
          mockServices.rootConfig.factory({
            data: {
              'my-plugin': {
                metrics: {
                  name: 'my-plugin-metrics',
                  version: '1.2.3',
                  schemaUrl: 'https://example.com/schema',
                },
              },
            },
          }),
          metricsServiceFactory,
        ],
      }).getSubject('my-plugin');

      expect(subject).toBeDefined();
      expect(typeof subject.createCounter).toBe('function');
      expect(typeof subject.createUpDownCounter).toBe('function');
      expect(typeof subject.createObservableGauge).toBe('function');
    });

    it('should use default plugin id when getSubject is called without plugin id', async () => {
      const subject = await ServiceFactoryTester.from(metricsServiceFactory, {
        dependencies: defaultServices,
      }).getSubject();

      expect(subject).toBeDefined();
      expect(subject.createCounter('test')).toBeDefined();
    });

    it('should return a service that implements MetricsService interface', async () => {
      const subject = await ServiceFactoryTester.from(metricsServiceFactory, {
        dependencies: defaultServices,
      }).getSubject('test-plugin');

      expect(subject.createCounter('counter')).toBeDefined();
      expect(subject.createUpDownCounter('updown')).toBeDefined();
      expect(subject.createHistogram('histogram')).toBeDefined();
      expect(subject.createGauge('gauge')).toBeDefined();
      expect(
        subject.createObservableCounter('observable_counter'),
      ).toBeDefined();
      expect(
        subject.createObservableUpDownCounter('observable_updown'),
      ).toBeDefined();
      expect(subject.createObservableGauge('observable_gauge')).toBeDefined();
    });
  });
});
