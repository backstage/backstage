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

/**
 * Attribute values that can be attached to metric measurements.
 *
 * @alpha
 */
export type MetricAttributeValue =
  | string
  | number
  | boolean
  | Array<null | undefined | string>
  | Array<null | undefined | number>
  | Array<null | undefined | boolean>;

/**
 * A set of key-value pairs that can be attached to metric measurements.
 *
 * @alpha
 */
export interface MetricAttributes {
  [attributeKey: string]: MetricAttributeValue | undefined;
}

/**
 * Advisory options that influence aggregation configuration.
 *
 * @alpha
 */
export interface MetricAdvice {
  /**
   * Hint the explicit bucket boundaries for histogram aggregation.
   */
  explicitBucketBoundaries?: number[];
}

/**
 * Options for creating a metric instrument.
 *
 * @alpha
 */
export interface MetricOptions {
  /**
   * The description of the Metric.
   */
  description?: string;
  /**
   * The unit of the Metric values.
   */
  unit?: string;
  /**
   * Advisory options that influence aggregation configuration.
   */
  advice?: MetricAdvice;
}

/**
 * A counter metric that only supports non-negative increments.
 *
 * @alpha
 */
export interface MetricsServiceCounter<
  TAttributes extends MetricAttributes = MetricAttributes,
> {
  add(value: number, attributes?: TAttributes): void;
}

/**
 * A counter metric that supports both positive and negative increments.
 *
 * @alpha
 */
export interface MetricsServiceUpDownCounter<
  TAttributes extends MetricAttributes = MetricAttributes,
> {
  add(value: number, attributes?: TAttributes): void;
}

/**
 * A histogram metric for recording distributions of values.
 *
 * @alpha
 */
export interface MetricsServiceHistogram<
  TAttributes extends MetricAttributes = MetricAttributes,
> {
  record(value: number, attributes?: TAttributes): void;
}

/**
 * A gauge metric for recording instantaneous values.
 *
 * @alpha
 */
export interface MetricsServiceGauge<
  TAttributes extends MetricAttributes = MetricAttributes,
> {
  record(value: number, attributes?: TAttributes): void;
}

/**
 * The result object passed to observable metric callbacks.
 *
 * @alpha
 */
export interface MetricsServiceObservableResult<
  TAttributes extends MetricAttributes = MetricAttributes,
> {
  observe(value: number, attributes?: TAttributes): void;
}

/**
 * A callback function for observable metrics. Called whenever a metric
 * collection is initiated.
 *
 * @alpha
 */
export type MetricsServiceObservableCallback<
  TAttributes extends MetricAttributes = MetricAttributes,
> = (
  observableResult: MetricsServiceObservableResult<TAttributes>,
) => void | Promise<void>;

/**
 * An observable metric instrument that reports values via callbacks.
 *
 * @alpha
 */
export interface MetricsServiceObservable<
  TAttributes extends MetricAttributes = MetricAttributes,
> {
  addCallback(callback: MetricsServiceObservableCallback<TAttributes>): void;
  removeCallback(callback: MetricsServiceObservableCallback<TAttributes>): void;
}

/**
 * An observable counter metric that reports non-negative sums via callbacks.
 *
 * @alpha
 */
export type MetricsServiceObservableCounter<
  TAttributes extends MetricAttributes = MetricAttributes,
> = MetricsServiceObservable<TAttributes>;

/**
 * An observable counter metric that reports sums that can go up or down
 * via callbacks.
 *
 * @alpha
 */
export type MetricsServiceObservableUpDownCounter<
  TAttributes extends MetricAttributes = MetricAttributes,
> = MetricsServiceObservable<TAttributes>;

/**
 * An observable gauge metric that reports instantaneous values via callbacks.
 *
 * @alpha
 */
export type MetricsServiceObservableGauge<
  TAttributes extends MetricAttributes = MetricAttributes,
> = MetricsServiceObservable<TAttributes>;

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
  createCounter<TAttributes extends MetricAttributes = MetricAttributes>(
    name: string,
    opts?: MetricOptions,
  ): MetricsServiceCounter<TAttributes>;

  /**
   * Creates a new up-down counter metric.
   *
   * @param name - The name of the metric.
   * @param opts - The options for the metric.
   * @returns The up-down counter metric.
   */
  createUpDownCounter<TAttributes extends MetricAttributes = MetricAttributes>(
    name: string,
    opts?: MetricOptions,
  ): MetricsServiceUpDownCounter<TAttributes>;

  /**
   * Creates a new histogram metric.
   *
   * @param name - The name of the metric.
   * @param opts - The options for the metric.
   * @returns The histogram metric.
   */
  createHistogram<TAttributes extends MetricAttributes = MetricAttributes>(
    name: string,
    opts?: MetricOptions,
  ): MetricsServiceHistogram<TAttributes>;

  /**
   * Creates a new gauge metric.
   *
   * @param name - The name of the metric.
   * @param opts - The options for the metric.
   * @returns The gauge metric.
   */
  createGauge<TAttributes extends MetricAttributes = MetricAttributes>(
    name: string,
    opts?: MetricOptions,
  ): MetricsServiceGauge<TAttributes>;

  /**
   * Creates a new observable counter metric.
   *
   * @param name - The name of the metric.
   * @param opts - The options for the metric.
   * @returns The observable counter metric.
   */
  createObservableCounter<
    TAttributes extends MetricAttributes = MetricAttributes,
  >(
    name: string,
    opts?: MetricOptions,
  ): MetricsServiceObservableCounter<TAttributes>;

  /**
   * Creates a new observable up-down counter metric.
   *
   * @param name - The name of the metric.
   * @param opts - The options for the metric.
   * @returns The observable up-down counter metric.
   */
  createObservableUpDownCounter<
    TAttributes extends MetricAttributes = MetricAttributes,
  >(
    name: string,
    opts?: MetricOptions,
  ): MetricsServiceObservableUpDownCounter<TAttributes>;

  /**
   * Creates a new observable gauge metric.
   *
   * @param name - The name of the metric.
   * @param opts - The options for the metric.
   * @returns The observable gauge metric.
   */
  createObservableGauge<
    TAttributes extends MetricAttributes = MetricAttributes,
  >(
    name: string,
    opts?: MetricOptions,
  ): MetricsServiceObservableGauge<TAttributes>;
}
