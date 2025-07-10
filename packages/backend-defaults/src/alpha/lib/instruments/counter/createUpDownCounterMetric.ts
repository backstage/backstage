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
import { Attributes, Meter, MetricOptions } from '@opentelemetry/api';
import { UpDownCounterMetric } from '@backstage/backend-plugin-api/alpha';

/**
 * Creates an up-down counter metric wrapper with consistent interface.
 *
 * @param meter - The OpenTelemetry meter instance
 * @param name - The name of the up-down counter metric
 * @param opts - Optional metric options
 * @returns An UpDownCounterMetric wrapper
 */
export function createUpDownCounterMetric(
  meter: Meter,
  name: string,
  opts?: MetricOptions,
): UpDownCounterMetric {
  const counter = meter.createUpDownCounter(name, opts);

  return {
    add: (value: number, attributes?: Attributes) => {
      counter.add(value, attributes);
    },
    subtract: (value: number, attributes?: Attributes) => {
      counter.add(-value, attributes);
    },
    increment: (attributes?: Attributes) => {
      counter.add(1, attributes);
    },
    decrement: (attributes?: Attributes) => {
      counter.add(-1, attributes);
    },
  };
}
