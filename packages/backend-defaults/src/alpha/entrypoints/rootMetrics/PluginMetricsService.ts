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

  createCounter(name: string, options?: MetricOptions): Counter {
    return this.meter.createCounter(this.prefixMetricName(name), options);
  }

  createUpDownCounter(name: string, options?: MetricOptions): UpDownCounter {
    return this.meter.createUpDownCounter(this.prefixMetricName(name), options);
  }

  createHistogram(name: string, options?: MetricOptions): Histogram {
    return this.meter.createHistogram(this.prefixMetricName(name), options);
  }

  createGauge(name: string, options?: MetricOptions): Gauge {
    return this.meter.createGauge(this.prefixMetricName(name), options);
  }

  createObservableCounter(
    name: string,
    options?: MetricOptions,
  ): ObservableCounter {
    return this.meter.createObservableCounter(
      this.prefixMetricName(name),
      options,
    );
  }

  createObservableUpDownCounter(
    name: string,
    options?: MetricOptions,
  ): ObservableUpDownCounter {
    return this.meter.createObservableUpDownCounter(
      this.prefixMetricName(name),
      options,
    );
  }

  createObservableGauge(
    name: string,
    options?: MetricOptions,
  ): ObservableGauge {
    return this.meter.createObservableGauge(
      this.prefixMetricName(name),
      options,
    );
  }
}
