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

export class PluginMetricsService implements MetricsService {
  private readonly meter: Meter;

  constructor(pluginId: string, version?: string) {
    this.meter = metrics.getMeter(pluginId, version);
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
