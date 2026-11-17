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

import type { TracingServiceSpanKind } from './TracingService';

/**
 * The kind of instrument that a metric was created with.
 *
 * @alpha
 */
export type TelemetryRegistryMetricType =
  | 'counter'
  | 'upDownCounter'
  | 'histogram'
  | 'gauge'
  | 'observableCounter'
  | 'observableUpDownCounter'
  | 'observableGauge';

/**
 * The definition of a metric instrument created through the metrics service.
 *
 * @alpha
 */
export interface TelemetryRegistryMetric {
  /** The ID of the plugin that created the metric. */
  pluginId: string;
  /** The name of the metric. */
  name: string;
  /** The kind of instrument. */
  type: TelemetryRegistryMetricType;
  /** The description of the metric, if one was provided. */
  description?: string;
  /** The unit of the metric, if one was provided. */
  unit?: string;
}

/**
 * A span name recorded through the tracing service.
 *
 * @alpha
 */
export interface TelemetryRegistrySpan {
  /** The ID of the plugin that started the span. */
  pluginId: string;
  /** The name of the span. */
  name: string;
  /** The kind of span. */
  kind: TracingServiceSpanKind;
  /** The number of times a span with this name has been started. */
  count: number;
  /** When a span with this name was last started, as an ISO 8601 string. */
  lastSeen: string;
}

/**
 * A root-scoped registry that keeps track of the metric instruments and span
 * names produced through the metrics and tracing services across all plugins.
 *
 * @remarks
 *
 * The registry only stores definitions, not metric values or span attributes.
 * Metrics and spans produced by calling the OpenTelemetry API directly are not
 * included.
 *
 * @alpha
 */
export interface TelemetryRegistryService {
  /**
   * Records the definition of a metric instrument.
   */
  registerMetric(metric: TelemetryRegistryMetric): void;

  /**
   * Records that a span was started.
   */
  registerSpan(span: {
    pluginId: string;
    name: string;
    kind: TracingServiceSpanKind;
  }): void;

  /**
   * Lists all recorded metric definitions.
   */
  listMetrics(): Promise<{ metrics: TelemetryRegistryMetric[] }>;

  /**
   * Lists all recorded span names.
   */
  listSpans(): Promise<{ spans: TelemetryRegistrySpan[] }>;
}
