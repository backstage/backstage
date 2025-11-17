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

/**
 * Schema for validating metric names. A metric name should follow snake_case convention
 *
 * {@link https://opentelemetry.io/docs/specs/semconv/general/metrics}
 */
const metricNameSchema = z
  .string()
  .min(1, 'Metric name cannot be empty')
  .regex(
    /^[a-z0-9]+(_[a-z0-9]+)*$/,
    "Metric name must follow snake_case convention (lowercase letters, numbers, and underscores only). Examples: 'request_count', 'api_response_time', 'http_errors'",
  );

/**
 * Schema for validating a namespace. A namespace is a string that is used to group metrics and cannot
 * be empty. It is defined by the hierarchical structure of metrics.
 *
 * {@link https://opentelemetry.io/docs/specs/semconv/general/naming/#general-naming-considerations}
 */
const namespaceSchema = z
  .string()
  .min(1, 'Metric namespace is required and cannot be empty');

/**
 * Required options for a metrics service.
 *
 * Handled by the framework and not intended to be used directly.
 *
 * @alpha
 * @internal
 */
export interface MetricsServiceOptions {
  /**
   * The meter for the metrics service.
   */
  meter: Meter;

  /**
   * The namespace for the metrics service.
   */
  namespace: string;
}

/**
 * Factory for creating instruments for a given namespace. Instruments are what produce metrics.
 *
 * @remarks
 * Used by the {@link DefaultMetricsService} and {@link DefaultRootMetricsService} to create instruments and is not intended to be used directly.
 *
 * @internal
 */
export class InstrumentFactory implements MetricsService {
  private readonly meter: Meter;
  private readonly namespace: string;

  constructor(opts: MetricsServiceOptions) {
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
    this.validateMetricName(name);
    return this.meter.createCounter(this.prefixName(name), opts);
  }

  createUpDownCounter(name: string, opts?: MetricOptions): UpDownCounter {
    this.validateMetricName(name);
    return this.meter.createUpDownCounter(this.prefixName(name), opts);
  }

  createHistogram(name: string, opts?: MetricOptions): Histogram {
    this.validateMetricName(name);
    return this.meter.createHistogram(this.prefixName(name), opts);
  }

  createGauge(name: string, opts?: MetricOptions): Gauge {
    this.validateMetricName(name);
    return this.meter.createGauge(this.prefixName(name), opts);
  }

  createObservableCounter(metric: ObservableMetric): ObservableCounter {
    this.validateMetricName(metric.name);

    const observable = this.meter.createObservableCounter(
      this.prefixName(metric.name),
      metric.opts,
    );

    observable.addCallback(metric.observable);
    return observable;
  }

  createObservableUpDownCounter(
    metric: ObservableMetric,
  ): ObservableUpDownCounter {
    this.validateMetricName(metric.name);

    const observable = this.meter.createObservableUpDownCounter(
      this.prefixName(metric.name),
      metric.opts,
    );

    observable.addCallback(metric.observable);
    return observable;
  }

  createObservableGauge(metric: ObservableMetric): ObservableGauge {
    this.validateMetricName(metric.name);

    const observable = this.meter.createObservableGauge(
      this.prefixName(metric.name),
      metric.opts,
    );

    observable.addCallback(metric.observable);
    return observable;
  }
}
