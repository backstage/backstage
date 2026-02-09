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
import { MetricsService } from '@backstage/backend-plugin-api/alpha';

/**
 * Default implementation of the {@link MetricsService} interface.
 *
 * @alpha
 */
export class DefaultMetricsService implements MetricsService {
  private readonly meter: Meter;

  private constructor(opts: {
    name: string;
    version?: string;
    schemaUrl?: string;
  }) {
    this.meter = metrics.getMeter(opts.name, opts.version, {
      schemaUrl: opts.schemaUrl,
    });
  }

  /**
   * Creates a new {@link MetricsService} instance.
   */
  static create(opts: {
    name: string;
    version?: string;
    schemaUrl?: string;
  }): MetricsService {
    return new DefaultMetricsService(opts);
  }

  createCounter<TAttributes extends Attributes = Attributes>(
    name: string,
    opts?: MetricOptions,
  ): Counter<TAttributes> {
    return this.meter.createCounter<TAttributes>(name, opts);
  }

  createUpDownCounter<TAttributes extends Attributes = Attributes>(
    name: string,
    opts?: MetricOptions,
  ): UpDownCounter<TAttributes> {
    return this.meter.createUpDownCounter<TAttributes>(name, opts);
  }

  createHistogram<TAttributes extends Attributes = Attributes>(
    name: string,
    opts?: MetricOptions,
  ): Histogram<TAttributes> {
    return this.meter.createHistogram<TAttributes>(name, opts);
  }

  createGauge<TAttributes extends Attributes = Attributes>(
    name: string,
    opts?: MetricOptions,
  ): Gauge<TAttributes> {
    return this.meter.createGauge<TAttributes>(name, opts);
  }

  createObservableCounter<TAttributes extends Attributes = Attributes>(
    name: string,
    opts?: MetricOptions,
  ): ObservableCounter<TAttributes> {
    return this.meter.createObservableCounter<TAttributes>(name, opts);
  }

  createObservableUpDownCounter<TAttributes extends Attributes = Attributes>(
    name: string,
    opts?: MetricOptions,
  ): ObservableUpDownCounter<TAttributes> {
    return this.meter.createObservableUpDownCounter<TAttributes>(name, opts);
  }

  createObservableGauge<TAttributes extends Attributes = Attributes>(
    name: string,
    opts?: MetricOptions,
  ): ObservableGauge<TAttributes> {
    return this.meter.createObservableGauge<TAttributes>(name, opts);
  }
}
