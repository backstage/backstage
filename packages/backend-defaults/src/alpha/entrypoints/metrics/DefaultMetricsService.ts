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
import {
  MetricsService,
  MetricAttributes,
  MetricOptions,
  MetricsServiceCounter,
  MetricsServiceUpDownCounter,
  MetricsServiceHistogram,
  MetricsServiceGauge,
  MetricsServiceObservableCounter,
  MetricsServiceObservableGauge,
  MetricsServiceObservableUpDownCounter,
} from '@backstage/backend-plugin-api/alpha';

/**
 * Options for creating a {@link DefaultMetricsService}.
 *
 * @alpha
 */
export interface DefaultMetricsServiceOptions {
  name: string;
  version?: string;
  schemaUrl?: string;
}

/**
 * Default implementation of the {@link MetricsService} interface.
 *
 * This implementation provides a thin wrapper around the OpenTelemetry Meter API.
 *
 * @alpha
 */
export class DefaultMetricsService implements MetricsService {
  private readonly meter: Meter;

  private constructor(opts: DefaultMetricsServiceOptions) {
    // The meter name sets the OpenTelemetry Instrumentation Scope which identifies the source of metrics in telemetry backends.
    this.meter = metrics.getMeter(opts.name, opts.version, {
      schemaUrl: opts.schemaUrl,
    });
  }

  /**
   * Creates a new {@link MetricsService} instance.
   *
   * @param opts - Options for configuring the meter scope
   * @returns A new MetricsService instance
   */
  static create(opts: DefaultMetricsServiceOptions): MetricsService {
    return new DefaultMetricsService(opts);
  }

  createCounter<TAttributes extends MetricAttributes = MetricAttributes>(
    name: string,
    opts?: MetricOptions,
  ): MetricsServiceCounter<TAttributes> {
    return this.meter.createCounter(name, opts);
  }

  createUpDownCounter<TAttributes extends MetricAttributes = MetricAttributes>(
    name: string,
    opts?: MetricOptions,
  ): MetricsServiceUpDownCounter<TAttributes> {
    return this.meter.createUpDownCounter(name, opts);
  }

  createHistogram<TAttributes extends MetricAttributes = MetricAttributes>(
    name: string,
    opts?: MetricOptions,
  ): MetricsServiceHistogram<TAttributes> {
    return this.meter.createHistogram(name, opts);
  }

  createGauge<TAttributes extends MetricAttributes = MetricAttributes>(
    name: string,
    opts?: MetricOptions,
  ): MetricsServiceGauge<TAttributes> {
    return this.meter.createGauge(name, opts);
  }

  createObservableCounter<
    TAttributes extends MetricAttributes = MetricAttributes,
  >(
    name: string,
    opts?: MetricOptions,
  ): MetricsServiceObservableCounter<TAttributes> {
    return this.meter.createObservableCounter(name, opts);
  }

  createObservableUpDownCounter<
    TAttributes extends MetricAttributes = MetricAttributes,
  >(
    name: string,
    opts?: MetricOptions,
  ): MetricsServiceObservableUpDownCounter<TAttributes> {
    return this.meter.createObservableUpDownCounter(name, opts);
  }

  createObservableGauge<
    TAttributes extends MetricAttributes = MetricAttributes,
  >(
    name: string,
    opts?: MetricOptions,
  ): MetricsServiceObservableGauge<TAttributes> {
    return this.meter.createObservableGauge(name, opts);
  }
}
