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
} from '@opentelemetry/api';

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
  createCounter(name: string, options?: MetricOptions): Counter;
  createUpDownCounter(name: string, options?: MetricOptions): UpDownCounter;
  createHistogram(name: string, options?: MetricOptions): Histogram;
  createGauge(name: string, options?: MetricOptions): Gauge;

  // Asynchronous Instruments
  createObservableCounter(
    name: string,
    options?: MetricOptions,
  ): ObservableCounter;
  createObservableUpDownCounter(
    name: string,
    options?: MetricOptions,
  ): ObservableUpDownCounter;
  createObservableGauge(name: string, options?: MetricOptions): ObservableGauge;
}
