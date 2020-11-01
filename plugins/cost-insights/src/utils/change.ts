/*
 * Copyright 2020 Spotify AB
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
  Cost,
  ChangeStatistic,
  ChangeThreshold,
  EngineerThreshold,
  GrowthType,
  MetricData,
} from '../types';
import { aggregationSort } from '../utils/sort';

// Used by <CostGrowth /> for displaying status colors
export function growthOf(amount: number, ratio: number) {
  if (amount >= EngineerThreshold && ratio >= ChangeThreshold.upper) {
    return GrowthType.Excess;
  }

  if (amount >= EngineerThreshold && ratio <= ChangeThreshold.lower) {
    return GrowthType.Savings;
  }

  return GrowthType.Negligible;
}

// Used by <CostOverviewCard /> for displaying engineer totals
export function getComparedChange(
  dailyCost: Cost,
  metricData: MetricData,
): ChangeStatistic {
  const ratio = dailyCost.change.ratio - metricData.change.ratio;
  const amount = dailyCost.aggregation.slice().sort(aggregationSort)[0].amount;
  return {
    ratio: ratio,
    amount: amount * ratio,
  };
}
