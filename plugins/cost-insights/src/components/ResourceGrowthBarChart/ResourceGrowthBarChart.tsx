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

import React from 'react';
import { TooltipPayload } from 'recharts';
import {
  currencyFormatter,
  dateRegex,
  formatDuration,
} from '../../utils/formatters';
import {
  BarChartData,
  CostInsightsTheme,
  DataKey,
  Duration,
  Entity,
  inclusiveEndDateOf,
  inclusiveStartDateOf,
  Maybe,
  ResourceData,
  AlertCost,
} from '../../types';
import BarChart from '../BarChart';
import { TooltipItemProps } from '../Tooltip';
import { useTheme } from '@material-ui/core';

export type ResourceGrowthBarChartProps = {
  duration: Duration;
  resources: Array<Entity | AlertCost>;
};

const ResourceGrowthBarChart = ({
  duration,
  resources,
}: ResourceGrowthBarChartProps) => {
  const theme = useTheme<CostInsightsTheme>();
  const getTooltipItem = (payload: TooltipPayload): Maybe<TooltipItemProps> => {
    const label = dateRegex.test(payload.name)
      ? formatDuration(payload.name, duration)
      : payload.name;
    const value =
      typeof payload.value === 'number'
        ? currencyFormatter.format(payload.value)
        : (payload.value as string);
    const fill = payload.fill as string;

    switch (payload.dataKey) {
      case DataKey.Current:
      case DataKey.Previous:
        return {
          label: label,
          value: value,
          fill: fill,
        };
      default:
        return null;
    }
  };

  const barChartData: BarChartData = {
    previousFill: theme.palette.lightBlue,
    currentFill: theme.palette.darkBlue,
    previousName: inclusiveStartDateOf(duration),
    currentName: inclusiveEndDateOf(duration),
  };

  const resourceData: ResourceData[] = resources.map(resource => {
    return {
      name: resource.id,
      previous: resource.aggregation[0],
      current: resource.aggregation[1],
    };
  });

  return (
    <BarChart
      barChartData={barChartData}
      getTooltipItem={getTooltipItem}
      resources={resourceData}
    />
  );
};

export default ResourceGrowthBarChart;
