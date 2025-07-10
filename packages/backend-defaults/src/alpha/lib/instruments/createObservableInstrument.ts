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
  CreateObservableMetricOptions,
} from '@backstage/backend-plugin-api/alpha';

/**
 * Creates an observable metric.
 *
 * @internal
 */
export function createObservableInstrument(
  options: CreateObservableMetricOptions & { type: ObservableInstrumentType },
): void {
  const { name, meter, observer, opts, type } = options;

  switch (type) {
    case 'counter':
      meter.createObservableCounter(name, opts).addCallback(observer);
      break;
    case 'up-down-counter':
      meter.createObservableUpDownCounter(name, opts).addCallback(observer);
      break;
    case 'gauge':
      meter.createObservableGauge(name, opts).addCallback(observer);
      break;
    default:
      meter.createObservableCounter(name, opts).addCallback(observer);
  }
}
