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
import {
  CounterMetric,
  UpDownCounterMetric,
  HistogramMetric,
  GaugeMetric,
} from './instruments';

/**
 * A service that provides a metrics facility aligned with OpenTelemetry Metrics Data Model.
 *
 * See the {@link https://backstage.io/docs/backend-system/core-services/metrics | service documentation} for more details.
 * See the {@link https://opentelemetry.io/docs/specs/otel/metrics/data-model/ | OpenTelemetry Metrics Data Model} for specification details.
 *
 * @alpha
 */
export interface MetricsService {
  // Synchronous Instruments
  createCounter(name: string, options?: MetricOptions): CounterMetric;
  createUpDownCounter(
    name: string,
    options?: MetricOptions,
  ): UpDownCounterMetric;
  createHistogram(name: string, options?: MetricOptions): HistogramMetric;
  createGauge(name: string, options?: MetricOptions): GaugeMetric;

  // Asynchronous Instruments
  createObservableCounter(
    name: string,
    observer: ObservableCallback<Attributes>,
    opts?: MetricOptions,
  ): void;

  createObservableUpDownCounter(
    name: string,
    observer: ObservableCallback<Attributes>,
    opts?: MetricOptions,
  ): void;

  createObservableGauge(
    name: string,
    observer: ObservableCallback<Attributes>,
    opts?: MetricOptions,
  ): void;

  getMeter(): Meter;
}
