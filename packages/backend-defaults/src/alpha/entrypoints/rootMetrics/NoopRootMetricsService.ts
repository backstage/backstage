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
import { Meter, MetricOptions, metrics } from '@opentelemetry/api';
import {
  CounterMetric,
  GaugeMetric,
  HistogramMetric,
  UpDownCounterMetric,
  MetricsService,
  RootMetricsService,
  CreateObservableMetricOptions,
} from '@backstage/backend-plugin-api/alpha';
import {
  createCounterMetric,
  createGaugeMetric,
  createHistogramMetric,
  createUpDownCounterMetric,
  createObservableCounterMetric,
  createObservableUpDownCounterMetric,
  createObservableGaugeMetric,
} from '../../lib';

export class NoopRootMetricsService implements RootMetricsService {
  private readonly meter: Meter;

  constructor() {
    this.meter = metrics.getMeter('noop');
  }

  forPlugin(_pluginId: string): MetricsService {
    return {} as MetricsService;
  }

  getMeter(): Meter {
    return this.meter;
  }

  createCounter(_name: string, _options?: MetricOptions): CounterMetric {
    return createCounterMetric({
      name: 'noop',
      meter: this.meter,
      opts: _options,
    });
  }

  createUpDownCounter(
    _name: string,
    _options?: MetricOptions,
  ): UpDownCounterMetric {
    return createUpDownCounterMetric({
      name: 'noop',
      meter: this.meter,
      opts: _options,
    });
  }

  createHistogram(_name: string, _options?: MetricOptions): HistogramMetric {
    return createHistogramMetric({
      name: 'noop',
      meter: this.meter,
      opts: _options,
    });
  }

  createGauge(_name: string, _options?: MetricOptions): GaugeMetric {
    return createGaugeMetric({
      name: 'noop',
      meter: this.meter,
      opts: _options,
    });
  }

  createObservableCounter(_opts: CreateObservableMetricOptions): void {
    return createObservableCounterMetric(_opts);
  }

  createObservableUpDownCounter(_opts: CreateObservableMetricOptions): void {
    return createObservableUpDownCounterMetric(_opts);
  }

  createObservableGauge(_opts: CreateObservableMetricOptions): void {
    return createObservableGaugeMetric(_opts);
  }
}
