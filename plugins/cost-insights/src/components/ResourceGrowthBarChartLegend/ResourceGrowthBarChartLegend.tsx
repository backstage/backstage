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
import { Box, useTheme } from '@material-ui/core';
import LegendItem from '../LegendItem';
import CostGrowth from '../CostGrowth';
import { currencyFormatter, formatDuration } from '../../utils/formatters';
import {
  ChangeStatistic,
  CostInsightsTheme,
  Duration,
  inclusiveEndDateOf,
  inclusiveStartDateOf,
} from '../../types';

export type ResourceGrowthBarChartLegendProps = {
  change: ChangeStatistic;
  duration: Duration;
  costStart: number;
  costEnd: number;
};

const ResourceGrowthBarChartLegend = ({
  change,
  duration,
  costStart,
  costEnd,
}: ResourceGrowthBarChartLegendProps) => {
  const theme = useTheme<CostInsightsTheme>();

  const startOf = inclusiveStartDateOf(duration);
  const endOf = inclusiveEndDateOf(duration);
  const periodStartTitle = formatDuration(startOf, duration);
  const periodEndTitle = formatDuration(endOf, duration);

  return (
    <Box display="flex" flexDirection="row">
      <Box marginRight={2}>
        <LegendItem
          title={periodStartTitle}
          markerColor={theme.palette.lightBlue}
        >
          {currencyFormatter.format(costStart)}
        </LegendItem>
      </Box>
      <Box marginRight={2}>
        <LegendItem title={periodEndTitle} markerColor={theme.palette.darkBlue}>
          {currencyFormatter.format(costEnd)}
        </LegendItem>
      </Box>
      <LegendItem title={`Cost ${change.ratio <= 0 ? 'Savings' : 'Growth'}`}>
        <CostGrowth change={change} duration={duration} />
      </LegendItem>
    </Box>
  );
};

export default ResourceGrowthBarChartLegend;
