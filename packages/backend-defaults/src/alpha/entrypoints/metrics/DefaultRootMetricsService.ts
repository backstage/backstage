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
  RootMetricsService,
} from '@backstage/backend-plugin-api/alpha';
import {
  Histogram,
  Counter,
  MeterProvider,
  UpDownCounter,
  MetricOptions,
  metrics,
  ObservableGauge,
  ObservableUpDownCounter,
  Gauge,
  ObservableCounter,
  Attributes,
} from '@opentelemetry/api';
import { InstrumentFactory } from './InstrumentFactory';
import { DefaultMetricsService } from './DefaultMetricsService';

function normalizeNamespace(id: string): string {
  return id.toLowerCase().replace(/-/g, '_').replace(/\./g, '_');
}

export class DefaultRootMetricsService implements RootMetricsService {
  private readonly rootNamespace: string = 'backstage';
  private readonly serviceNamespace: string = `${this.rootNamespace}.service`;
  private readonly pluginNamespace: string = `${this.rootNamespace}.plugin`;
  private readonly instrumentFactory: InstrumentFactory;

  private readonly globalMeterProvider: MeterProvider =
    metrics.getMeterProvider();

  private constructor() {
    this.instrumentFactory = new InstrumentFactory({
      meter: this.globalMeterProvider.getMeter(this.rootNamespace),
      namespace: this.rootNamespace,
    });
  }

  static create(): RootMetricsService {
    return new DefaultRootMetricsService();
  }

  forService(serviceId: string): MetricsService {
    const namespace = `${this.serviceNamespace}.${normalizeNamespace(
      serviceId,
    )}`;

    return DefaultMetricsService.create(namespace);
  }

  forPlugin(pluginId: string): MetricsService {
    const namespace = `${this.pluginNamespace}.${normalizeNamespace(pluginId)}`;
    return DefaultMetricsService.create(namespace);
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
    opts?: MetricOptions,
  ): ObservableCounter<TAttributes> {
    return this.instrumentFactory.createObservableCounter(name, opts);
  }

  createObservableUpDownCounter<TAttributes extends Attributes = Attributes>(
    name: string,
    opts?: MetricOptions,
  ): ObservableUpDownCounter<TAttributes> {
    return this.instrumentFactory.createObservableUpDownCounter(name, opts);
  }

  createObservableGauge<TAttributes extends Attributes = Attributes>(
    name: string,
    opts?: MetricOptions,
  ): ObservableGauge<TAttributes> {
    return this.instrumentFactory.createObservableGauge(name, opts);
  }
}
