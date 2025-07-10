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
  ObservableMetricOptions,
  UpDownCounterMetric,
} from '@backstage/backend-plugin-api/alpha';
import { Meter, MetricOptions, metrics } from '@opentelemetry/api';
import {
  createCounterMetric,
  createGaugeMetric,
  createHistogramMetric,
  createUpDownCounterMetric,
} from '../../lib';
import { createObservableInstrument } from '../../lib/instruments/observable';

export type PluginMetricsServiceOptions = {
  pluginId: string;
  serviceName: string;
  serviceVersion?: string;
};

export class PluginMetricsService implements MetricsService {
  private readonly meter: Meter;
  private readonly pluginId: string;
  private readonly serviceName: string;

  constructor(options: PluginMetricsServiceOptions) {
    this.pluginId = options.pluginId;
    this.serviceName = options.serviceName;
    this.meter = metrics.getMeter(options.serviceName, options.serviceVersion);
  }

  private prefixMetricName(name: string): string {
    return `${this.serviceName}.plugin.${this.pluginId}.${name}`;
  }

  createCounter(name: string, options?: MetricOptions): CounterMetric {
    return createCounterMetric(
      this.meter,
      this.prefixMetricName(name),
      options,
    );
  }

  createUpDownCounter(
    name: string,
    options?: MetricOptions,
  ): UpDownCounterMetric {
    return createUpDownCounterMetric(
      this.meter,
      this.prefixMetricName(name),
      options,
    );
  }

  createHistogram(name: string, options?: MetricOptions): HistogramMetric {
    return createHistogramMetric(
      this.meter,
      this.prefixMetricName(name),
      options,
    );
  }

  createGauge(name: string, options?: MetricOptions): GaugeMetric {
    return createGaugeMetric(this.meter, this.prefixMetricName(name), options);
  }

  createObservableCounter(opts: ObservableMetricOptions): void {
    createObservableInstrument('counter', {
      name: this.prefixMetricName(opts.name),
      meter: this.meter,
      observer: opts.observer,
      opts: opts.opts,
    });
  }

  createObservableUpDownCounter(opts: ObservableMetricOptions): void {
    createObservableInstrument('up-down-counter', {
      name: this.prefixMetricName(opts.name),
      meter: this.meter,
      observer: opts.observer,
      opts: opts.opts,
    });
  }

  createObservableGauge(opts: ObservableMetricOptions): void {
    createObservableInstrument('gauge', {
      name: this.prefixMetricName(opts.name),
      meter: this.meter,
      observer: opts.observer,
      opts: opts.opts,
    });
  }
}
