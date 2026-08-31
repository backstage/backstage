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
import { Meter, metrics } from '@opentelemetry/api';
import { DefaultMetricsService } from './DefaultMetricsService';

// The real (noop) OpenTelemetry API meter provider used in tests collapses
// every getMeter()/createXxx() call to shared singleton objects, which makes
// it impossible to observe per-scope behavior. Each test instead gets a
// fresh, independently-trackable fake Meter so instrument creation can be
// asserted per meter/scope.
function createFakeMeter(): jest.Mocked<Meter> {
  return {
    createCounter: jest.fn(name => ({ name, add: jest.fn() })),
    createUpDownCounter: jest.fn(name => ({ name, add: jest.fn() })),
    createHistogram: jest.fn(name => ({ name, record: jest.fn() })),
    createGauge: jest.fn(name => ({ name, record: jest.fn() })),
    createObservableCounter: jest.fn(name => ({
      name,
      addCallback: jest.fn(),
      removeCallback: jest.fn(),
    })),
    createObservableUpDownCounter: jest.fn(name => ({
      name,
      addCallback: jest.fn(),
      removeCallback: jest.fn(),
    })),
    createObservableGauge: jest.fn(name => ({
      name,
      addCallback: jest.fn(),
      removeCallback: jest.fn(),
    })),
    addBatchObservableCallback: jest.fn(),
    removeBatchObservableCallback: jest.fn(),
  } as unknown as jest.Mocked<Meter>;
}

const mockGetMeter = jest.spyOn(metrics, 'getMeter');

describe('DefaultMetricsService', () => {
  beforeEach(() => {
    mockGetMeter.mockReset();
    mockGetMeter.mockImplementation(() => createFakeMeter());
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
      const counter = service.createCounter('metric_instruments_counter', {
        description: 'A test counter',
        unit: 'bytes',
      });

      expect(counter).toBeDefined();
      expect(counter.add).toBeDefined();
    });

    it('should create an up-down counter', () => {
      const service = DefaultMetricsService.create({ name: 'test' });
      const upDownCounter = service.createUpDownCounter(
        'metric_instruments_updown',
      );

      expect(upDownCounter).toBeDefined();
      expect(upDownCounter.add).toBeDefined();
    });

    it('should create a histogram', () => {
      const service = DefaultMetricsService.create({ name: 'test' });
      const histogram = service.createHistogram('metric_instruments_histogram');

      expect(histogram).toBeDefined();
      expect(histogram.record).toBeDefined();
    });

    it('should create a gauge', () => {
      const service = DefaultMetricsService.create({ name: 'test' });
      const gauge = service.createGauge('metric_instruments_gauge');

      expect(gauge).toBeDefined();
      expect(gauge.record).toBeDefined();
    });

    it('should create an observable counter', () => {
      const service = DefaultMetricsService.create({ name: 'test' });
      const counter = service.createObservableCounter(
        'metric_instruments_observable_counter',
      );

      expect(counter).toBeDefined();
      expect(counter.addCallback).toBeDefined();
      expect(counter.removeCallback).toBeDefined();
    });

    it('should create an observable up-down counter', () => {
      const service = DefaultMetricsService.create({ name: 'test' });
      const counter = service.createObservableUpDownCounter(
        'metric_instruments_observable_updown',
      );

      expect(counter).toBeDefined();
      expect(counter.addCallback).toBeDefined();
    });

    it('should create an observable gauge', () => {
      const service = DefaultMetricsService.create({ name: 'test' });
      const gauge = service.createObservableGauge(
        'metric_instruments_observable_gauge',
      );

      expect(gauge).toBeDefined();
      expect(gauge.addCallback).toBeDefined();
    });
  });

  describe('instrument deduplication', () => {
    it('should reuse a single instrument for the same metric name across different meter scopes', () => {
      const serviceA = DefaultMetricsService.create({ name: 'plugin-a' });
      const meterA = mockGetMeter.mock.results[0].value as jest.Mocked<Meter>;

      const instrumentA = serviceA.createCounter('shared_across_plugins');
      expect(meterA.createCounter).toHaveBeenCalledTimes(1);

      const serviceB = DefaultMetricsService.create({ name: 'plugin-b' });
      const meterB = mockGetMeter.mock.results[1].value as jest.Mocked<Meter>;

      const instrumentB = serviceB.createCounter('shared_across_plugins');

      // The second meter's createCounter should never be called for a metric
      // name that's already cached, otherwise the underlying OpenTelemetry
      // Prometheus exporter would emit a duplicate HELP/TYPE block for the
      // same metric name and break the Prometheus text format.
      expect(meterB.createCounter).not.toHaveBeenCalled();
      expect(instrumentB).toBe(instrumentA);
    });

    it('should create separate instruments for different metric names', () => {
      const service = DefaultMetricsService.create({ name: 'plugin-c' });
      const meter = mockGetMeter.mock.results[0].value as jest.Mocked<Meter>;

      service.createCounter('distinct_metric_one');
      service.createCounter('distinct_metric_two');

      expect(meter.createCounter).toHaveBeenCalledTimes(2);
    });

    it('should not share instruments across different instrument kinds with the same name', () => {
      const service = DefaultMetricsService.create({ name: 'plugin-d' });
      const meter = mockGetMeter.mock.results[0].value as jest.Mocked<Meter>;

      const counter = service.createCounter('same_name');
      const gauge = service.createGauge('same_name');

      expect(meter.createCounter).toHaveBeenCalledTimes(1);
      expect(meter.createGauge).toHaveBeenCalledTimes(1);
      expect(counter).not.toBe(gauge);
    });
  });
});
