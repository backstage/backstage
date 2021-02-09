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
  DateAggregation,
} from '../types';
import dayjs, { OpUnitType } from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import { inclusiveStartDateOf } from './duration';

dayjs.extend(durationPlugin);

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
  lastCompleteBillingDate: string, // YYYY-MM-DD,
): ChangeStatistic {
  const ratio = dailyCost.change!.ratio - metricData.change.ratio;
  const previousPeriodTotal = getPreviousPeriodTotalCost(
    dailyCost.aggregation,
    duration,
    lastCompleteBillingDate,
  );
  return {
    ratio: ratio,
    amount: previousPeriodTotal * ratio,
  };
}

export function getPreviousPeriodTotalCost(
  aggregation: DateAggregation[],
  duration: Duration,
  inclusiveEndDate: string,
): number {
  const dayjsDuration = dayjs.duration(duration);
  const startDate = inclusiveStartDateOf(duration, inclusiveEndDate);
  // dayjs doesn't allow adding an ISO 8601 period to dates.
  const [amount, type]: [number, OpUnitType] = dayjsDuration.days()
    ? [dayjsDuration.days(), 'day']
    : [dayjsDuration.months(), 'month'];
  const nextPeriodStart = dayjs(startDate).add(amount, type);

  // Add up costs that incurred before the start of the next period.
  return aggregation.reduce((acc, costByDate) => {
    return dayjs(costByDate.date).isBefore(nextPeriodStart)
      ? acc + costByDate.amount
      : acc;
  }, 0);
}
