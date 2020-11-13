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
  Duration,
} from '../types';
import { aggregationSort } from '../utils/sort';
import moment from 'moment';

// Used for displaying status colors
export function growthOf(ratio: number, amount?: number) {
  if (typeof amount === 'number') {
    if (amount >= EngineerThreshold && ratio >= ChangeThreshold.upper) {
      return GrowthType.Excess;
    }
    if (amount >= EngineerThreshold && ratio <= ChangeThreshold.lower) {
      return GrowthType.Savings;
    }
  } else {
    if (ratio >= ChangeThreshold.upper) return GrowthType.Excess;
    if (ratio <= ChangeThreshold.lower) return GrowthType.Savings;
  }

  return GrowthType.Negligible;
}

// Used by <CostOverviewCard /> for displaying engineer totals
export function getComparedChange(
  dailyCost: Cost,
  metricData: MetricData,
  duration: Duration,
): ChangeStatistic {
  const ratio = dailyCost.change.ratio - metricData.change.ratio;
  const previousPeriodTotal = getPreviousPeriodTotalCost(dailyCost, duration);
  return {
    ratio: ratio,
    amount: previousPeriodTotal * ratio,
  };
}

export function getPreviousPeriodTotalCost(
  dailyCost: Cost,
  duration: Duration,
): number {
  const costsByDate = dailyCost.aggregation.slice().sort(aggregationSort);
  const nextPeriodStart = moment(costsByDate[0].date).add(
    moment.duration(duration),
  );

  // Add up costs that incurred before the start of the next period.
  return costsByDate.reduce((acc, costByDate) => {
    return moment(costByDate.date).isBefore(nextPeriodStart)
      ? acc + costByDate.amount
      : acc;
  }, 0);
}
