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
import { Meter, MetricOptions } from '@opentelemetry/api';
import { GaugeMetric } from '@backstage/backend-plugin-api/alpha';

/**
 * Creates a gauge metric wrapper with consistent interface.
 *
 * @param meter - The OpenTelemetry meter instance
 * @param name - The name of the gauge metric
 * @param opts - Optional metric options
 * @returns A GaugeMetric wrapper
 */
export function createGaugeMetric(
  meter: Meter,
  name: string,
  opts?: MetricOptions,
): GaugeMetric {
  // Note: OpenTelemetry doesn't have a synchronous gauge
  // This is a placeholder that returns the observable gauge
  // In practice, you might want to use an observable gauge with callbacks
  const gauge = meter.createObservableGauge(name, opts);

  return {
    set: (value: number, labels?: Record<string, string>) => {
      // This is a simplified implementation
      // In practice, you'd want to manage callback registration properly
      gauge.addCallback(result => {
        result.observe(value, labels);
      });
    },
  };
}
