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
  ObservableInstrumentType,
  ObservableMetricOptions,
} from '@backstage/backend-plugin-api/alpha';
import {
  ObservableCounter,
  ObservableGauge,
  ObservableUpDownCounter,
} from '@opentelemetry/api';

/**
 * Creates an observable counter metric wrapper with consistent interface.
 *
 * @param meter - The OpenTelemetry meter instance
 * @param name - The name of the observable counter metric
 * @param opts - Optional metric options
 * @returns An ObservableCounterMetric wrapper
 */
export function createObservableInstrument(
  type: ObservableInstrumentType,
  options: ObservableMetricOptions,
): void {
  const { name, meter, observer, opts } = options;
  let observableInstrument:
    | ObservableCounter
    | ObservableUpDownCounter
    | ObservableGauge;

  switch (type) {
    case 'counter':
      observableInstrument = meter.createObservableCounter(name, opts);
      break;
    case 'up-down-counter':
      observableInstrument = meter.createObservableUpDownCounter(name, opts);
      break;
    case 'gauge':
      observableInstrument = meter.createObservableGauge(name, opts);
      break;
    default:
      observableInstrument = meter.createObservableCounter(name, opts);
  }

  observableInstrument.addCallback(observer);
}
