/*
 * Copyright 2022 The Backstage Authors
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

import { groupBy } from 'lodash';

import { FilterStatusType, statusTypes } from '../../apis/types';
import { Countify, ChartableStageDatapoints } from '../types';
import { startOfDay } from './utils';

export function countBuildsPerDay(
  values: ReadonlyArray<ChartableStageDatapoints>,
) {
  const days = groupBy(values, value => startOfDay(value.__epoch));
  Object.entries(days).forEach(([_startOfDay, valuesThisDay]) => {
    const counts = Object.fromEntries(
      statusTypes
        .map(
          type =>
            [
              type,
              valuesThisDay.filter(value => value[type] !== undefined).length,
            ] as const,
        )
        .filter(([_type, count]) => count > 0)
        .map(([type, count]): [Countify<FilterStatusType>, number] => [
          `${type} count`,
          count,
        ]),
    );

    // Assign the count for this day to the first value this day
    Object.assign(valuesThisDay[0], counts);
  });
}
