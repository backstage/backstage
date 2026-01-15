/*
 * Copyright 2026 The Backstage Authors
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
  Counter,
  Gauge,
  Histogram,
  MetricOptions,
  ObservableCounter,
  ObservableGauge,
  ObservableUpDownCounter,
  UpDownCounter,
} from '@opentelemetry/api';

/**
 * A service that provides a facility for emitting metrics.
 *
 * @alpha
 */
export interface MetricsService {
  /**
   * Creates a new counter metric.
   *
   * @param name - The name of the metric.
   * @param opts - The options for the metric.
   * @returns The counter metric.
   */
  createCounter<TAttributes extends Attributes>(
    name: string,
    opts?: MetricOptions,
  ): Counter<TAttributes>;

  /**
   * Creates a new up-down counter metric.
   *
   * @param name - The name of the metric.
   * @param opts - The options for the metric.
   * @returns The up-down counter metric.
   */
  createUpDownCounter<TAttributes extends Attributes>(
    name: string,
    opts?: MetricOptions,
  ): UpDownCounter<TAttributes>;

  /**
   * Creates a new histogram metric.
   *
   * @param name - The name of the metric.
   * @param opts - The options for the metric.
   * @returns The histogram metric.
   */
  createHistogram<TAttributes extends Attributes>(
    name: string,
    opts?: MetricOptions,
  ): Histogram<TAttributes>;

  /**
   * Creates a new gauge metric.
   *
   * @param name - The name of the metric.
   * @param opts - The options for the metric.
   * @returns The gauge metric.
   */
  createGauge<TAttributes extends Attributes>(
    name: string,
    opts?: MetricOptions,
  ): Gauge<TAttributes>;

  /**
   * Creates a new observable counter metric.
   *
   * @param name - The name of the metric.
   * @param opts - The options for the metric.
   * @returns The observable counter metric.
   */
  createObservableCounter<TAttributes extends Attributes>(
    name: string,
    opts?: MetricOptions,
  ): ObservableCounter<TAttributes>;

  /**
   * Creates a new observable up-down counter metric.
   *
   * @param name - The name of the metric.
   * @param opts - The options for the metric.
   * @returns The observable up-down counter metric.
   */
  createObservableUpDownCounter<TAttributes extends Attributes>(
    name: string,
    opts?: MetricOptions,
  ): ObservableUpDownCounter<TAttributes>;

  /**
   * Creates a new observable gauge metric.
   *
   * @param name - The name of the metric.
   * @param opts - The options for the metric.
   * @returns The observable gauge metric.
   */
  createObservableGauge<TAttributes extends Attributes>(
    name: string,
    opts?: MetricOptions,
  ): ObservableGauge<TAttributes>;
}
