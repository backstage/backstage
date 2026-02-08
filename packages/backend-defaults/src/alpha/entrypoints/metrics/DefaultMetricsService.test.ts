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

  describe('createCounter', () => {
    it('should return a counter instrument', () => {
      const service = DefaultMetricsService.create({ name: 'test' });
      const counter = service.createCounter('my_counter');

      expect(counter).toBeDefined();
    });

    it('should accept optional MetricOptions', () => {
      const service = DefaultMetricsService.create({ name: 'test' });
      const counter = service.createCounter('my_counter', {
        description: 'A test counter',
        unit: 'bytes',
      });

      expect(counter).toBeDefined();
    });
  });

  describe('createUpDownCounter', () => {
    it('should return an up-down counter instrument', () => {
      const service = DefaultMetricsService.create({ name: 'test' });
      const upDownCounter = service.createUpDownCounter('my_updown');

      expect(upDownCounter).toBeDefined();
    });
  });

  describe('createHistogram', () => {
    it('should return a histogram instrument', () => {
      const service = DefaultMetricsService.create({ name: 'test' });
      const histogram = service.createHistogram('my_histogram');

      expect(histogram).toBeDefined();
    });
  });

  describe('createGauge', () => {
    it('should return a gauge instrument', () => {
      const service = DefaultMetricsService.create({ name: 'test' });
      const gauge = service.createGauge('my_gauge');

      expect(gauge).toBeDefined();
    });
  });

  describe('createObservableCounter', () => {
    it('should return an observable counter instrument', () => {
      const service = DefaultMetricsService.create({ name: 'test' });
      const observableCounter = service.createObservableCounter(
        'my_observable_counter',
      );

      expect(observableCounter).toBeDefined();
    });
  });

  describe('createObservableUpDownCounter', () => {
    it('should return an observable up-down counter instrument', () => {
      const service = DefaultMetricsService.create({ name: 'test' });
      const observableUpDownCounter = service.createObservableUpDownCounter(
        'my_observable_updown',
      );

      expect(observableUpDownCounter).toBeDefined();
    });
  });

  describe('createObservableGauge', () => {
    it('should return an observable gauge instrument', () => {
      const service = DefaultMetricsService.create({ name: 'test' });
      const observableGauge = service.createObservableGauge(
        'my_observable_gauge',
      );

      expect(observableGauge).toBeDefined();
    });
  });
});
