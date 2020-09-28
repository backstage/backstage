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
import BarChart from '../BarChart';
import { TooltipItemProps } from '../Tooltip';
import {
  BarChartData,
  CostInsightsTheme,
  ResourceData,
  UnlabeledDataflowAlertProject,
} from '../../types';
import { currencyFormatter } from '../../utils/formatters';
import { useTheme } from '@material-ui/core';

type UnlabeledDataflowBarChartProps = {
  projects: Array<UnlabeledDataflowAlertProject>;
};

export const UnlabeledDataflowBarChart = ({
  projects,
}: UnlabeledDataflowBarChartProps) => {
  const theme = useTheme<CostInsightsTheme>();
  const barChartData: BarChartData = {
    previousFill: theme.palette.lightBlue,
    currentFill: theme.palette.darkBlue,
    previousName: 'Unlabeled Cost',
    currentName: 'Labeled Cost',
  };

  const getTooltipItem = (payload: TooltipPayload): TooltipItemProps => {
    return {
      label: payload.name,
      value:
        typeof payload.value === 'number'
          ? currencyFormatter.format(payload.value)
          : (payload.value as string),
      fill: payload.fill as string,
    };
  };

  const resources: ResourceData[] = projects.map(project => {
    return {
      name: project.id,
      previous: project.unlabeledCost || 0,
      current: project.labeledCost || 0,
    };
  });

  return (
    <BarChart
      barChartData={barChartData}
      resources={resources}
      getTooltipItem={getTooltipItem}
    />
  );
};

export default UnlabeledDataflowBarChart;
