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

export class NoopRootMetricsService implements RootMetricsService {
  forPlugin(_pluginId: string): MetricsService {
    return {} as MetricsService;
  }

  createCounter(_name: string, _options?: MetricOptions): Counter {
    return metrics.getMeter('noop').createCounter('noop');
  }

  createUpDownCounter(_name: string, _options?: MetricOptions): UpDownCounter {
    return metrics.getMeter('noop').createUpDownCounter('noop');
  }

  createHistogram(_name: string, _options?: MetricOptions): Histogram {
    return metrics.getMeter('noop').createHistogram('noop');
  }

  createGauge(_name: string, _options?: MetricOptions): Gauge {
    return metrics.getMeter('noop').createGauge('noop');
  }

  createObservableCounter(
    _name: string,
    _options?: MetricOptions,
  ): ObservableCounter {
    return metrics.getMeter('noop').createObservableCounter('noop');
  }

  createObservableUpDownCounter(
    _name: string,
    _options?: MetricOptions,
  ): ObservableUpDownCounter {
    return metrics.getMeter('noop').createObservableUpDownCounter('noop');
  }

  createObservableGauge(
    _name: string,
    _options?: MetricOptions,
  ): ObservableGauge {
    return metrics.getMeter('noop').createObservableGauge('noop');
  }
}
