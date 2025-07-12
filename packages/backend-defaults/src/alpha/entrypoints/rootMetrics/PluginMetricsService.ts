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
import {
  CounterMetric,
  GaugeMetric,
  HistogramMetric,
  MetricsService,
  UpDownCounterMetric,
  ObservableMetricOptions,
} from '@backstage/backend-plugin-api/alpha';
import {
  Attributes,
  Meter,
  MetricOptions,
  metrics,
  ObservableCallback,
} from '@opentelemetry/api';
import {
  createCounterMetric,
  createGaugeMetric,
  createHistogramMetric,
  createUpDownCounterMetric,
  createMetricNamePrefixer,
  createObservableUpDownCounterMetric,
  createObservableGaugeMetric,
  createObservableCounterMetric,
} from '../../lib';

export type PluginMetricsServiceOptions = {
  pluginId: string;
  serviceName: string;
  serviceVersion?: string;
};

export class PluginMetricsService implements MetricsService {
  private readonly meter: Meter;
  private readonly pluginId: string;
  private readonly serviceName: string;
  private readonly prefixMetricName: (name: string) => string;

  constructor(opts: PluginMetricsServiceOptions) {
    this.pluginId = opts.pluginId;
    this.serviceName = opts.serviceName;
    this.meter = metrics.getMeter(opts.serviceName, opts.serviceVersion);
    this.prefixMetricName = createMetricNamePrefixer({
      serviceName: this.serviceName,
      scope: 'plugin',
      pluginId: this.pluginId,
    });
  }

  getMeter(): Meter {
    return this.meter;
  }

  createCounter(name: string, opts?: MetricOptions): CounterMetric {
    return createCounterMetric({
      meter: this.meter,
      name: this.prefixMetricName(name),
      opts,
    });
  }

  createUpDownCounter(name: string, opts?: MetricOptions): UpDownCounterMetric {
    return createUpDownCounterMetric({
      meter: this.meter,
      name: this.prefixMetricName(name),
      opts,
    });
  }

  createHistogram(name: string, opts?: MetricOptions): HistogramMetric {
    return createHistogramMetric({
      meter: this.meter,
      name: this.prefixMetricName(name),
      opts,
    });
  }

  createGauge(name: string, opts?: MetricOptions): GaugeMetric {
    return createGaugeMetric({
      meter: this.meter,
      name: this.prefixMetricName(name),
      opts,
    });
  }

  createObservableCounter(
    name: string,
    observer: ObservableCallback<Attributes>,
    opts?: MetricOptions,
  ): void {
    createObservableCounterMetric({
      name: this.prefixMetricName(name),
      meter: this.meter,
      observer,
      opts,
    });
  }

  createObservableUpDownCounter(
    name: string,
    observer: ObservableCallback<Attributes>,
    opts?: MetricOptions,
  ): void {
    createObservableUpDownCounterMetric({
      name: this.prefixMetricName(name),
      meter: this.meter,
      observer,
      opts,
    });
  }

  createObservableGauge(
    name: string,
    observer: ObservableCallback<Attributes>,
    opts?: MetricOptions,
  ): void {
    createObservableGaugeMetric({
      name: this.prefixMetricName(name),
      meter: this.meter,
      observer,
      opts,
    });
  }
}
