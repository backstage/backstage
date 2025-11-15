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
import { RootLoggerService } from '@backstage/backend-plugin-api';
import {
  MetricsService,
  ObservableMetric,
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
} from '@opentelemetry/api';
import { DefaultMetricsService } from './DefaultMetricsService';
import { InstrumentFactory } from './InstrumentFactory';

export class DefaultRootMetricsService implements RootMetricsService {
  private readonly rootNamespace: string = 'backstage';
  private readonly rootMetricsPrefix: string = 'backstage.core';
  private readonly globalMeterProvider: MeterProvider;
  private readonly rootLogger?: RootLoggerService;
  private readonly instrumentFactory: InstrumentFactory;

  private constructor({ rootLogger }: { rootLogger?: RootLoggerService }) {
    this.rootLogger = rootLogger;
    this.globalMeterProvider = metrics.getMeterProvider();
    this.instrumentFactory = new InstrumentFactory({
      meter: this.globalMeterProvider.getMeter(this.rootNamespace),
      namespace: this.rootMetricsPrefix,
    });
  }

  static forRoot(opts?: {
    rootLogger?: RootLoggerService;
  }): RootMetricsService {
    return new DefaultRootMetricsService({
      rootLogger: opts?.rootLogger,
    });
  }

  forPlugin(pluginId: string): MetricsService {
    this.rootLogger?.info('Creating plugin-scoped metrics service', {
      pluginId,
    });

    const namespace = `${this.rootNamespace}.plugin.${pluginId}`;
    const meter = this.globalMeterProvider.getMeter(namespace);

    return new DefaultMetricsService({
      meter,
      namespace: pluginId,
    });
  }

  createCounter(name: string, opts?: MetricOptions): Counter {
    return this.instrumentFactory.createCounter(name, opts);
  }

  createUpDownCounter(name: string, opts?: MetricOptions): UpDownCounter {
    return this.instrumentFactory.createUpDownCounter(name, opts);
  }

  createHistogram(name: string, opts?: MetricOptions): Histogram {
    return this.instrumentFactory.createHistogram(name, opts);
  }

  createGauge(name: string, opts?: MetricOptions): Gauge {
    return this.instrumentFactory.createGauge(name, opts);
  }

  createObservableCounter(metric: ObservableMetric): ObservableCounter {
    return this.instrumentFactory.createObservableCounter(metric);
  }

  createObservableUpDownCounter(
    metric: ObservableMetric,
  ): ObservableUpDownCounter {
    return this.instrumentFactory.createObservableUpDownCounter(metric);
  }

  createObservableGauge(metric: ObservableMetric): ObservableGauge {
    return this.instrumentFactory.createObservableGauge(metric);
  }
}
