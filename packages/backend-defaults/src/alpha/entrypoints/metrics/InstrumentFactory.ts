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
  MetricServiceOpts,
  MetricsService,
  ObservableMetric,
} from '@backstage/backend-plugin-api/alpha';
import {
  Counter,
  Histogram,
  Gauge,
  Meter,
  MetricOptions,
  ObservableCounter,
  ObservableGauge,
  ObservableUpDownCounter,
  UpDownCounter,
} from '@opentelemetry/api';
import z from 'zod';

const metricNameSchema = z
  .string()
  .min(1, 'Metric name cannot be empty')
  .regex(
    /^[a-z0-9]+(_[a-z0-9]+)*$/,
    "Metric name must follow snake_case convention (lowercase letters, numbers, and underscores only). Examples: 'request_count', 'api_response_time', 'http_errors'",
  );

const namespaceSchema = z
  .string()
  .min(1, 'Metric namespace is required and cannot be empty');

/**
 * Factory for creating OpenTelemetry metrics instruments.
 *
 * @internal
 * @alpha
 */
export class InstrumentFactory implements MetricsService {
  private readonly meter: Meter;
  private readonly namespace: string;

  constructor(opts: MetricServiceOpts) {
    if (!opts.meter) {
      throw new Error('Meter is required for metric instrument creation');
    }

    this.meter = opts.meter;
    this.namespace = namespaceSchema.parse(opts.namespace);
  }

  private validateMetricName(name: string): string {
    return metricNameSchema.parse(name);
  }

  private prefixName(name: string): string {
    return `${this.namespace}.${name}`.toLowerCase();
  }

  createCounter(name: string, opts?: MetricOptions): Counter {
    const validatedName = this.validateMetricName(name);

    return this.meter.createCounter(this.prefixName(validatedName), opts);
  }

  createUpDownCounter(name: string, opts?: MetricOptions): UpDownCounter {
    const validatedName = this.validateMetricName(name);

    return this.meter.createUpDownCounter(this.prefixName(validatedName), opts);
  }

  createHistogram(name: string, opts?: MetricOptions): Histogram {
    const validatedName = this.validateMetricName(name);

    return this.meter.createHistogram(this.prefixName(validatedName), opts);
  }

  createGauge(name: string, opts?: MetricOptions): Gauge {
    const validatedName = this.validateMetricName(name);

    return this.meter.createGauge(this.prefixName(validatedName), opts);
  }

  createObservableCounter(metric: ObservableMetric): ObservableCounter {
    const validatedName = this.validateMetricName(metric.name);

    const observable = this.meter.createObservableCounter(
      this.prefixName(validatedName),
      metric.opts,
    );

    observable.addCallback(metric.observable);
    return observable;
  }

  createObservableUpDownCounter(
    metric: ObservableMetric,
  ): ObservableUpDownCounter {
    const validatedName = this.validateMetricName(metric.name);

    const observable = this.meter.createObservableUpDownCounter(
      this.prefixName(validatedName),
      metric.opts,
    );

    observable.addCallback(metric.observable);
    return observable;
  }

  createObservableGauge(metric: ObservableMetric): ObservableGauge {
    const validatedName = this.validateMetricName(metric.name);

    const observable = this.meter.createObservableGauge(
      this.prefixName(validatedName),
      metric.opts,
    );

    observable.addCallback(metric.observable);
    return observable;
  }
}
