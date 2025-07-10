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
import { MetricOptions, metrics } from '@opentelemetry/api';
import {
  CounterMetric,
  GaugeMetric,
  HistogramMetric,
  UpDownCounterMetric,
  MetricsService,
  RootMetricsService,
  ObservableMetricOptions,
} from '@backstage/backend-plugin-api/alpha';
import {
  createCounterMetric,
  createGaugeMetric,
  createHistogramMetric,
  createUpDownCounterMetric,
} from '../../lib';
import { createObservableInstrument } from '../../lib/instruments';

export class NoopRootMetricsService implements RootMetricsService {
  forPlugin(_pluginId: string): MetricsService {
    return {} as MetricsService;
  }

  createCounter(_name: string, _options?: MetricOptions): CounterMetric {
    return createCounterMetric(metrics.getMeter('noop'), 'noop');
  }

  createUpDownCounter(
    _name: string,
    _options?: MetricOptions,
  ): UpDownCounterMetric {
    return createUpDownCounterMetric(metrics.getMeter('noop'), 'noop');
  }

  createHistogram(_name: string, _options?: MetricOptions): HistogramMetric {
    return createHistogramMetric(metrics.getMeter('noop'), 'noop');
  }

  createGauge(_name: string, _options?: MetricOptions): GaugeMetric {
    return createGaugeMetric(metrics.getMeter('noop'), 'noop');
  }

  createObservableCounter(_opts: ObservableMetricOptions): void {
    return createObservableInstrument('counter', _opts);
  }

  createObservableUpDownCounter(_opts: ObservableMetricOptions): void {
    return createObservableInstrument('up-down-counter', _opts);
  }

  createObservableGauge(_opts: ObservableMetricOptions): void {
    return createObservableInstrument('gauge', _opts);
  }
}
