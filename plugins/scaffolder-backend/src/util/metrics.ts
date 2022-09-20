/*
 * Copyright 2021 The Backstage Authors
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
  CounterConfiguration,
  Gauge,
  GaugeConfiguration,
  Histogram,
  HistogramConfiguration,
  register,
  Summary,
  SummaryConfiguration,
} from 'prom-client';

export function createCounterMetric<T extends string>(
  config: CounterConfiguration<T>,
): Counter<T> {
  let metric = register.getSingleMetric(config.name);
  if (!metric) {
    metric = new Counter<T>(config);
    register.registerMetric(metric);
  }
  return metric as Counter<T>;
}

export function createGaugeMetric<T extends string>(
  config: GaugeConfiguration<T>,
): Gauge<T> {
  let metric = register.getSingleMetric(config.name);
  if (!metric) {
    metric = new Gauge<T>(config);
    register.registerMetric(metric);
  }
  return metric as Gauge<T>;
}

export function createSummaryMetric<T extends string>(
  config: SummaryConfiguration<T>,
): Summary<T> {
  let metric = register.getSingleMetric(config.name);
  if (!metric) {
    metric = new Summary<T>(config);
    register.registerMetric(metric);
  }

  return metric as Summary<T>;
}

export function createHistogramMetric<T extends string>(
  config: HistogramConfiguration<T>,
): Histogram<T> {
  let metric = register.getSingleMetric(config.name);
  if (!metric) {
    metric = new Histogram<T>(config);
    register.registerMetric(metric);
  }

  return metric as Histogram<T>;
}
