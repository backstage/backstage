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
import { Box, Card, CardContent, Divider, useTheme } from '@material-ui/core';
import CostGrowth from '../CostGrowth';
import CostOverviewChart from '../CostOverviewChart';
import CostOverviewHeader from './CostOverviewHeader';
import LegendItem from '../LegendItem';
import MetricSelect from '../MetricSelect';
import PeriodSelect from '../PeriodSelect';
import { useScroll, useFilters, useConfig } from '../../hooks';
import { mapFiltersToProps } from './selector';
import { DefaultNavigation } from '../../utils/navigation';
import { formatPercent } from '../../utils/formatters';
import {
  ChangeStatistic,
  CostInsightsTheme,
  DateAggregation,
  Project,
  Trendline,
  findAlways,
} from '../../types';

type CostOverviewCardProps = {
  change: ChangeStatistic;
  aggregation: Array<DateAggregation>;
  trendline: Trendline;
  projects: Array<Project>;
};

const CostOverviewCard = ({
  change,
  aggregation,
  trendline,
}: CostOverviewCardProps) => {
  const theme = useTheme<CostInsightsTheme>();
  const config = useConfig();
  const { ScrollAnchor } = useScroll(DefaultNavigation.CostOverviewCard);
  const { setDuration, setProject, setMetric, ...filters } = useFilters(
    mapFiltersToProps,
  );

  const metric = findAlways(config.metrics, m => m.kind === filters.metric);

  return (
    <Card style={{ position: 'relative' }}>
      <ScrollAnchor behavior="smooth" top={-20} />
      <CardContent>
        <CostOverviewHeader title="Cloud Cost">
          <PeriodSelect duration={filters.duration} onSelect={setDuration} />
        </CostOverviewHeader>
        <Divider />
        <Box my={1} display="flex" flexDirection="row">
          <Box mr={2}>
            <LegendItem
              title={`${metric.name} Trend`}
              markerColor={theme.palette.blue}
            >
              {formatPercent(change.ratio)}
            </LegendItem>
          </Box>
          <LegendItem
            title={`Your ${change.ratio <= 0 ? 'Savings' : 'Excess'}`}
          >
            <CostGrowth change={change} duration={filters.duration} />
          </LegendItem>
        </Box>
        <CostOverviewChart
          responsive
          metric={filters.metric}
          tooltip={`Daily Cost per ${metric.name}`}
          aggregation={aggregation}
          trendline={trendline}
        />
        <Box display="flex" justifyContent="flex-end" alignItems="center">
          {config.metrics.length > 1 && (
            <MetricSelect
              metric={filters.metric}
              metrics={config.metrics}
              onSelect={setMetric}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CostOverviewCard;
