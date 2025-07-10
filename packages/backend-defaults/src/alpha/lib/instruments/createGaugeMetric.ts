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
import { Attributes } from '@opentelemetry/api';
import {
  CreateMetricOptions,
  GaugeMetric,
} from '@backstage/backend-plugin-api/alpha';

/**
 * Creates a gauge metric wrapper with consistent interface.
 *
 * @param meter - The OpenTelemetry meter instance
 * @param name - The name of the gauge metric
 * @param opts - Optional metric options
 * @returns A GaugeMetric wrapper
 */
export function createGaugeMetric(opts: CreateMetricOptions): GaugeMetric {
  const { name, meter, opts: metricOpts } = opts;
  const gauge = meter.createGauge(name, metricOpts);

  return {
    set: (value: number, attributes?: Attributes) => {
      gauge.record(value, attributes);
    },
  };
}
