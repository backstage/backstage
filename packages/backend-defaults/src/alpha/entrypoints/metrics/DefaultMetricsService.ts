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

import { MetricsService } from '@backstage/backend-plugin-api/alpha';
import {
  Counter,
  Histogram,
  MetricOptions,
  Gauge,
  ObservableCounter,
  ObservableUpDownCounter,
  ObservableGauge,
  UpDownCounter,
  Attributes,
  metrics,
} from '@opentelemetry/api';
import { InstrumentFactory } from './InstrumentFactory';

/**
 * @alpha
 */
export class DefaultMetricsService implements MetricsService {
  private readonly instrumentFactory: InstrumentFactory;

  private constructor(pluginId: string) {
    // TODO: putting this namespace here default this service to being a "PluginMetricsService" which is not what we want.
    const namespace = `backstage.plugin.${pluginId}`;

    this.instrumentFactory = new InstrumentFactory({
      meter: metrics.getMeter(namespace),
      namespace,
    });
  }

  static create(pluginId: string): MetricsService {
    return new DefaultMetricsService(pluginId);
  }

  createCounter<TAttributes extends Attributes = Attributes>(
    name: string,
    opts?: MetricOptions,
  ): Counter<TAttributes> {
    return this.instrumentFactory.createCounter(name, opts);
  }

  createUpDownCounter<TAttributes extends Attributes = Attributes>(
    name: string,
    opts?: MetricOptions,
  ): UpDownCounter<TAttributes> {
    return this.instrumentFactory.createUpDownCounter(name, opts);
  }

  createHistogram<TAttributes extends Attributes = Attributes>(
    name: string,
    opts?: MetricOptions,
  ): Histogram<TAttributes> {
    return this.instrumentFactory.createHistogram(name, opts);
  }

  createGauge<TAttributes extends Attributes = Attributes>(
    name: string,
    opts?: MetricOptions,
  ): Gauge<TAttributes> {
    return this.instrumentFactory.createGauge(name, opts);
  }

  createObservableCounter<TAttributes extends Attributes = Attributes>(
    name: string,
    options?: MetricOptions,
  ): ObservableCounter<TAttributes> {
    return this.instrumentFactory.createObservableCounter(name, options);
  }

  createObservableUpDownCounter<TAttributes extends Attributes = Attributes>(
    name: string,
    options?: MetricOptions,
  ): ObservableUpDownCounter<TAttributes> {
    return this.instrumentFactory.createObservableUpDownCounter(name, options);
  }

  createObservableGauge<TAttributes extends Attributes = Attributes>(
    name: string,
    options?: MetricOptions,
  ): ObservableGauge<TAttributes> {
    return this.instrumentFactory.createObservableGauge(name, options);
  }
}
