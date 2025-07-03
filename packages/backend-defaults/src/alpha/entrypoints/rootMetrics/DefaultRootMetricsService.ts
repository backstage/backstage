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
  Counter,
  Gauge,
  Histogram,
  Meter,
  MetricOptions,
  ObservableCounter,
  ObservableGauge,
  ObservableUpDownCounter,
  UpDownCounter,
  metrics,
} from '@opentelemetry/api';
import {
  MetricsService,
  RootMetricsService,
} from '@backstage/backend-plugin-api/alpha';
import { Config } from '@backstage/config';
import { PluginMetricsService } from './PluginMetricsService';

export class DefaultRootMetricsService implements RootMetricsService {
  private readonly meter: Meter;
  private readonly serviceName: string;
  private readonly serviceVersion?: string;

  private constructor(config: Config) {
    const metricsConfig = config.getOptionalConfig('backend.metrics');

    this.serviceName =
      metricsConfig?.getOptionalString('resource.serviceName') ?? 'backstage';
    this.serviceVersion = metricsConfig?.getOptionalString(
      'resource.serviceVersion',
    );

    this.meter = metrics.getMeter(this.serviceName, this.serviceVersion);
  }

  static create(config: Config): RootMetricsService {
    return new DefaultRootMetricsService(config);
  }

  static fromConfig(config: Config): RootMetricsService {
    return new DefaultRootMetricsService(config);
  }

  forPlugin(pluginId: string): MetricsService {
    return new PluginMetricsService({
      pluginId,
      serviceName: this.serviceName,
      serviceVersion: this.serviceVersion,
    });
  }

  createCounter(name: string, options?: MetricOptions): Counter {
    return this.meter.createCounter(name, options);
  }

  createUpDownCounter(name: string, options?: MetricOptions): UpDownCounter {
    return this.meter.createUpDownCounter(name, options);
  }

  createHistogram(name: string, options?: MetricOptions): Histogram {
    return this.meter.createHistogram(name, options);
  }

  createGauge(name: string, options?: MetricOptions): Gauge {
    return this.meter.createGauge(name, options);
  }

  createObservableCounter(
    name: string,
    options?: MetricOptions,
  ): ObservableCounter {
    return this.meter.createObservableCounter(name, options);
  }

  createObservableUpDownCounter(
    name: string,
    options?: MetricOptions,
  ): ObservableUpDownCounter {
    return this.meter.createObservableUpDownCounter(name, options);
  }

  createObservableGauge(
    name: string,
    options?: MetricOptions,
  ): ObservableGauge {
    return this.meter.createObservableGauge(name, options);
  }

  getMeter(): Meter {
    return this.meter;
  }
}
