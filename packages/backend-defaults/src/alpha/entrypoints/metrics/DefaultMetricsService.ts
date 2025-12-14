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
  Attributes,
  Counter,
  Gauge,
  Histogram,
  Meter,
  MetricOptions,
  metrics,
  ObservableCounter,
  ObservableGauge,
  ObservableUpDownCounter,
  UpDownCounter,
} from '@opentelemetry/api';
import {
  MetricsService,
  MetricsServiceOptions,
} from '@backstage/backend-plugin-api/alpha';
import z from 'zod';

const namespaceSchema = z
  .string()
  .min(1, 'Metric namespace is required and cannot be empty')
  .startsWith('backstage.');

/**
 * Default implementation of the {@link MetricsService} interface.
 *
 * This implementation wraps the OpenTelemetry Meter API and automatically
 * namespaces all metric names with the configured namespace prefix.
 *
 * @alpha
 */
export class DefaultMetricsService implements MetricsService {
  private readonly meter: Meter;
  private readonly namespace: string;

  private constructor(opts: MetricsServiceOptions) {
    this.namespace = namespaceSchema.parse(opts.namespace);
    this.meter = metrics.getMeter(this.namespace, opts.version, {
      schemaUrl: opts.schemaUrl,
    });
  }

  /**
   * Creates a new {@link MetricsService} instance.
   *
   * @param opts - Configuration options including the namespace
   * @returns A new MetricsService instance
   */
  static create(opts: MetricsServiceOptions): MetricsService {
    return new DefaultMetricsService(opts);
  }

  private namespacedName(name: string): string {
    return `${this.namespace}.${name}`;
  }

  createCounter<TAttributes extends Attributes = Attributes>(
    name: string,
    opts?: MetricOptions,
  ): Counter<TAttributes> {
    return this.meter.createCounter(this.namespacedName(name), opts);
  }

  createUpDownCounter<TAttributes extends Attributes = Attributes>(
    name: string,
    opts?: MetricOptions,
  ): UpDownCounter<TAttributes> {
    return this.meter.createUpDownCounter(this.namespacedName(name), opts);
  }

  createHistogram<TAttributes extends Attributes = Attributes>(
    name: string,
    opts?: MetricOptions,
  ): Histogram<TAttributes> {
    return this.meter.createHistogram(this.namespacedName(name), opts);
  }

  createGauge<TAttributes extends Attributes = Attributes>(
    name: string,
    opts?: MetricOptions,
  ): Gauge<TAttributes> {
    return this.meter.createGauge(this.namespacedName(name), opts);
  }

  createObservableCounter<TAttributes extends Attributes = Attributes>(
    name: string,
    opts?: MetricOptions,
  ): ObservableCounter<TAttributes> {
    return this.meter.createObservableCounter(this.namespacedName(name), opts);
  }

  createObservableUpDownCounter<TAttributes extends Attributes = Attributes>(
    name: string,
    opts?: MetricOptions,
  ): ObservableUpDownCounter<TAttributes> {
    return this.meter.createObservableUpDownCounter(
      this.namespacedName(name),
      opts,
    );
  }

  createObservableGauge<TAttributes extends Attributes = Attributes>(
    name: string,
    opts?: MetricOptions,
  ): ObservableGauge<TAttributes> {
    return this.meter.createObservableGauge(this.namespacedName(name), opts);
  }
}
