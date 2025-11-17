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
  ObservableMetric,
} from '@backstage/backend-plugin-api/alpha';
import {
  Counter,
  Histogram,
  MetricOptions,
  Gauge,
  ObservableCounter,
  ObservableUpDownCounter,
  ObservableGauge,
  UpDownCounter,
} from '@opentelemetry/api';
import { InstrumentFactory, MetricsServiceOptions } from './InstrumentFactory';

/**
 * @alpha
 */
export class DefaultMetricsService implements MetricsService {
  private readonly instrumentFactory: InstrumentFactory;

  constructor(opts: MetricsServiceOptions) {
    this.instrumentFactory = new InstrumentFactory(opts);
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
