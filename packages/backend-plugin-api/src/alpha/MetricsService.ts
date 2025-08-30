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
  Counter,
  Gauge,
  Histogram,
  MetricOptions,
  ObservableCallback,
  ObservableCounter,
  ObservableGauge,
  ObservableUpDownCounter,
  UpDownCounter,
} from '@opentelemetry/api';

/**
 * A metric instrument that can be observed.
 *
 * @alpha
 */
export interface ObservableMetric {
  /**
   * The name of the instrument.
   */
  name: string;

  /**
   * The callback to be called when the instrument is observed.
   */
  observable: ObservableCallback<Attributes>;

  /**
   * The options for the instrument.
   */
  opts: MetricOptions;
}

/**
 * A service that provides a metrics facility.
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
  createCounter(name: string, opts?: MetricOptions): Counter;

  /**
   * Creates a new up-down counter metric.
   *
   * @param name - The name of the metric.
   * @param opts - The options for the metric.
   * @returns The up-down counter metric.
   */
  createUpDownCounter(name: string, opts?: MetricOptions): UpDownCounter;

  /**
   * Creates a new histogram metric.
   *
   * @param name - The name of the metric.
   * @param opts - The options for the metric.
   * @returns The histogram metric.
   */
  createHistogram(name: string, opts?: MetricOptions): Histogram;

  /**
   * Creates a new gauge metric.
   *
   * @param name - The name of the metric.
   * @param opts - The options for the metric.
   * @returns The gauge metric.
   */
  createGauge(name: string, opts?: MetricOptions): Gauge;

  /**
   * Creates a new observable counter metric.
   *
   * @param metric - The metric to create.
   * @returns The observable counter metric.
   */
  createObservableCounter(metric: ObservableMetric): ObservableCounter;

  /**
   * Creates a new observable up-down counter metric.
   *
   * @param metric - The metric to create.
   * @returns The observable up-down counter metric.
   */
  createObservableUpDownCounter(
    metric: ObservableMetric,
  ): ObservableUpDownCounter;

  /**
   * Creates a new observable gauge metric.
   *
   * @param metric - The metric to create.
   * @returns The observable gauge metric.
   */
  createObservableGauge(metric: ObservableMetric): ObservableGauge;
}

/**
 * A service that provides a metrics facility for root scoped services.
 *
 * @alpha
 */
export interface RootMetricsService extends MetricsService {
  /**
   * Creates a new metrics service for a plugin.
   *
   * @param pluginId - The ID of the plugin.
   * @returns The metrics service for the plugin.
   */
  forPlugin(pluginId: string): MetricsService;
}
