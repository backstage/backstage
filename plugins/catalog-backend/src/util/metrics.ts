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
  const existing = register.getSingleMetric(config.name) as Counter<T>;
  return existing || new Counter<T>(config);
}

export function createGaugeMetric<T extends string>(
  config: GaugeConfiguration<T>,
): Gauge<T> {
  const existing = register.getSingleMetric(config.name) as Gauge<T>;
  return existing || new Gauge<T>(config);
}

export function createSummaryMetric<T extends string>(
  config: SummaryConfiguration<T>,
): Summary<T> {
  const existing = register.getSingleMetric(config.name) as Summary<T>;
  return existing || new Summary<T>(config);
}

export function createHistogramMetric<T extends string>(
  config: HistogramConfiguration<T>,
): Histogram<T> {
  const existing = register.getSingleMetric(config.name) as Histogram<T>;
  return existing || new Histogram<T>(config);
}
