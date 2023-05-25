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

import { Config } from '@backstage/config';
import { HumanDuration } from '@backstage/types';

/**
 * Performs the act of stitching - to take all of the various outputs from the
 * ingestion process, and stitching them together into the final entity JSON
 * shape.
 */
export interface Stitcher {
  stitch(options: {
    entityRefs?: Iterable<string>;
    entityIds?: Iterable<string>;
  }): Promise<void>;
}

/**
 * The strategies supported by the stitching process, in terms of when to
 * perform stitching.
 *
 * @remarks
 *
 * In immediate mode, stitching happens "in-band" (blocking) immediately when
 * each processing task finishes. When set to `'deferred'`, stitching is instead
 * deferred to happen on a separate asynchronous worker queue just like
 * processing.
 *
 * Deferred stitching should make performance smoother when ingesting large
 * amounts of entities, and reduce p99 processing times and repeated
 * over-stitching of hot spot entities when fan-out/fan-in in terms of relations
 * is very large. It does however also come with some performance cost due to
 * the queuing with how much wall-clock time some types of task take.
 */
export type StitchingStrategy =
  | {
      mode: 'immediate';
    }
  | {
      mode: 'deferred';
      pollingInterval: HumanDuration;
      stitchTimeout: HumanDuration;
    };

export function stitchingStrategyFromConfig(config: Config): StitchingStrategy {
  const strategyMode = config.getOptionalString(
    'catalog.stitchingStrategy.mode',
  );

  if (strategyMode === undefined || strategyMode === 'immediate') {
    return {
      mode: 'immediate',
    };
  } else if (strategyMode === 'deferred') {
    // TODO(freben): Make parameters configurable
    return {
      mode: 'deferred',
      pollingInterval: { seconds: 1 },
      stitchTimeout: { seconds: 60 },
    };
  }

  throw new Error(
    `Invalid stitching strategy mode '${strategyMode}', expected one of 'immediate' or 'deferred'`,
  );
}
