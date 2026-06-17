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
import { metrics } from '@opentelemetry/api';
import { DefaultMetricsService } from './DefaultMetricsService';

const mockGetMeter = jest.spyOn(metrics, 'getMeter');

describe('DefaultMetricsService', () => {
  beforeEach(() => {
    mockGetMeter.mockClear();
  });

  describe('create', () => {
    it('should create a MetricsService with name only', () => {
      const service = DefaultMetricsService.create({ name: 'test-meter' });

      expect(mockGetMeter).toHaveBeenCalledTimes(1);
      expect(mockGetMeter).toHaveBeenCalledWith('test-meter', undefined, {
        schemaUrl: undefined,
      });

      expect(service).toBeDefined();
    });

    it('should create a MetricsService with name, version, and schemaUrl', () => {
      const service = DefaultMetricsService.create({
        name: 'test-meter',
        version: '1.2.3',
        schemaUrl: 'https://example.com/schema',
      });

      expect(mockGetMeter).toHaveBeenCalledTimes(1);
      expect(mockGetMeter).toHaveBeenCalledWith('test-meter', '1.2.3', {
        schemaUrl: 'https://example.com/schema',
      });

      expect(service).toBeDefined();
    });
  });

  describe('metric instruments', () => {
    it('should create a counter', () => {
      const service = DefaultMetricsService.create({ name: 'test' });
      const counter = service.createCounter('my_counter', {
        description: 'A test counter',
        unit: 'bytes',
      });

      expect(counter).toBeDefined();
      expect(counter.add).toBeDefined();
    });

    it('should create an up-down counter', () => {
      const service = DefaultMetricsService.create({ name: 'test' });
      const upDownCounter = service.createUpDownCounter('my_updown');

      expect(upDownCounter).toBeDefined();
      expect(upDownCounter.add).toBeDefined();
    });

    it('should create a histogram', () => {
      const service = DefaultMetricsService.create({ name: 'test' });
      const histogram = service.createHistogram('my_histogram');

      expect(histogram).toBeDefined();
      expect(histogram.record).toBeDefined();
    });

    it('should create a gauge', () => {
      const service = DefaultMetricsService.create({ name: 'test' });
      const gauge = service.createGauge('my_gauge');

      expect(gauge).toBeDefined();
      expect(gauge.record).toBeDefined();
    });

    it('should create an observable counter', () => {
      const service = DefaultMetricsService.create({ name: 'test' });
      const counter = service.createObservableCounter('my_observable_counter');

      expect(counter).toBeDefined();
      expect(counter.addCallback).toBeDefined();
      expect(counter.removeCallback).toBeDefined();
    });

    it('should create an observable up-down counter', () => {
      const service = DefaultMetricsService.create({ name: 'test' });
      const counter = service.createObservableUpDownCounter(
        'my_observable_updown',
      );

      expect(counter).toBeDefined();
      expect(counter.addCallback).toBeDefined();
    });

    it('should create an observable gauge', () => {
      const service = DefaultMetricsService.create({ name: 'test' });
      const gauge = service.createObservableGauge('my_observable_gauge');

      expect(gauge).toBeDefined();
      expect(gauge.addCallback).toBeDefined();
    });
  });
});
