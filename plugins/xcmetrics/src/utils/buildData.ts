/*
 * Copyright 2021 The Backstage Authors
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

import { formatDuration } from '.';
import { BuildCount, BuildTime } from '../api';

export const getErrorRatios = (buildCounts?: BuildCount[]) => {
  if (!buildCounts?.length) {
    return undefined;
  }

  return buildCounts.map(counts =>
    counts.builds === 0 ? 0 : counts.errors / counts.builds,
  );
};

export const getAverageDuration = (
  buildTimes: BuildTime[] | undefined,
  field: (b: BuildTime) => number,
) => {
  if (!buildTimes?.length) {
    return undefined;
  }

  return formatDuration(
    buildTimes.reduce((sum, current) => sum + field(current), 0) /
      buildTimes.length,
  );
};
