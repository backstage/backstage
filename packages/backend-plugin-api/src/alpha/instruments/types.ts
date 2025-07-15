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
  Attributes,
  Meter,
  MetricOptions,
  ObservableCallback,
} from '@opentelemetry/api';

/**
 * A counter metric.
 *
 * @remarks
 * A value that accumulates over time, but cannot go down.
 *
 * @public
 */
export interface CounterMetric {
  /**
   * Increment the counter by the specified value.
   *
   * @param value - The amount to increment by.
   * @param labels - Additional labels for this observation
   *
   * @public
   */
  add(value: number, attributes?: Attributes): void;

  /**
   * Increment the counter by 1 with optional labels.
   *
   * @param labels - Additional labels for this observation
   *
   * @remarks
   * If you need to increment by a value other than 1, use the `add` method.
   *
   * @public
   */
  increment(attributes?: Attributes): void;
}

/**
 * An up-down counter metric
 *
 * @remarks
 * A value that accumulates over time, but can also go down again.
 *
 * @public
 */
export interface UpDownCounterMetric {
  /**
   * Add the specified value to the counter.
   *
   * @param value - The amount to add to the counter.
   * @param labels - Additional labels for this observation
   *
   * @public
   */
  add(value: number, attributes?: Attributes): void;

  /**
   * Subtract the specified value from the counter.
   *
   * @param value - The amount to subtract from the counter.
   * @param labels - Additional labels for this observation
   *
   * @public
   */
  subtract(value: number, attributes?: Attributes): void;

  /**
   * Increment the counter by 1 with optional labels.
   *
   * @remarks
   * If you need to increment by a value other than 1, use the `add` method.
   *
   * @param labels - Additional labels for this observation
   *
   * @public
   */
  increment(attributes?: Attributes): void;

  /**
   * Decrement the counter by 1 with optional labels.
   *
   * @remarks
   * If you need to decrement by a value other than 1, use the `subtract` method.
   *
   * @param labels - Additional labels for this observation
   *
   * @public
   */
  decrement(attributes?: Attributes): void;
}

export interface HistogramMetric {
  /**
   * Record a value in the histogram.
   *
   * @param value - The value to record
   * @param labels - Additional labels for this observation
   *
   * @public
   */
  record(value: number, attributes?: Attributes): void;
}

export interface GaugeMetric {
  /**
   * Set the gauge to the specified value.
   *
   * @param value - The value to set the gauge to
   * @param labels - Additional labels for this observation
   *
   * @public
   */
  set(value: number, attributes?: Attributes): void;
}

export type ObservableInstrumentType = 'counter' | 'up-down-counter' | 'gauge';

export type CreateMetricOptions = {
  name: string;
  meter: Meter;
  opts?: MetricOptions;
};

export type CreateObservableMetricOptions = CreateMetricOptions & {
  observer: ObservableCallback<Attributes>;
};
