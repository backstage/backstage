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
  CreateMetricOptions,
  HistogramMetric,
} from '@backstage/backend-plugin-api/alpha';
import { Attributes } from '@opentelemetry/api';

export const createHistogramMetric = (
  opts: CreateMetricOptions,
): HistogramMetric => {
  const { name, meter, opts: metricOpts } = opts;
  const histogram = meter.createHistogram(name, metricOpts);

  return {
    record: (value: number, attributes?: Attributes) => {
      histogram.record(value, attributes);
    },
  };
};
