/*
 * Copyright 2023 The Backstage Authors
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

import { stringifyError } from '@backstage/errors';
import { metrics } from '@opentelemetry/api';
import { Knex } from 'knex';
import { DateTime } from 'luxon';
import { Logger } from 'winston';
import { createCounterMetric } from '../util/metrics';

// Helps wrap the timing and logging behaviors
export function progressTracker(_knex: Knex, logger: Logger) {
  // prom-client metrics are deprecated in favour of OpenTelemetry metrics.
  const promStitchedEntities = createCounterMetric({
    name: 'catalog_stitched_entities_count',
    help: 'Amount of entities stitched. DEPRECATED, use OpenTelemetry metrics instead',
  });

  const meter = metrics.getMeter('default');

  const stitchedEntities = meter.createCounter(
    'catalog.stitched.entities.count',
    {
      description: 'Amount of entities stitched',
    },
  );

  const stitchingDuration = meter.createHistogram(
    'catalog.stitching.duration',
    {
      description: 'Time spent executing the full stitching flow',
      unit: 'seconds',
    },
  );

  function stitchStart(item: {
    entityRef: string;
    stitchRequestedAt?: DateTime;
  }) {
    logger.debug(`Stitching ${item.entityRef}`);

    const startTime = process.hrtime();

    function endTime() {
      const delta = process.hrtime(startTime);
      return delta[0] + delta[1] / 1e9;
    }

    function markComplete(result: string) {
      promStitchedEntities.inc(1);
      stitchedEntities.add(1, { result });
      stitchingDuration.record(endTime(), { result });
    }

    function markFailed(error: Error) {
      promStitchedEntities.inc(1);
      stitchedEntities.add(1, { result: 'error' });
      stitchingDuration.record(endTime(), { result: 'error' });
      logger.error(
        `Failed to stitch ${item.entityRef}, ${stringifyError(error)}`,
      );
    }

    return {
      markComplete,
      markFailed,
    };
  }

  return { stitchStart };
}
