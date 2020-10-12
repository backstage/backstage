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
import { Box, Card, CardContent, Divider } from '@material-ui/core';
import CostOverviewChart from '../CostOverviewChart';
import CostOverviewChartLegend from '../CostOverviewChartLegend';
import CostOverviewHeader from './CostOverviewHeader';
import MetricSelect from '../MetricSelect';
import PeriodSelect from '../PeriodSelect';
import { useScroll, useFilters, useConfig } from '../../hooks';
import { mapFiltersToProps } from './selector';
import { DefaultNavigation } from '../../utils/navigation';
import {
  ChangeStatistic,
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
  const { metrics } = useConfig();
  const { ScrollAnchor } = useScroll(DefaultNavigation.CostOverviewCard);
  const { setDuration, setProject, metric, setMetric, ...filters } = useFilters(
    mapFiltersToProps,
  );

  const { name } = findAlways(metrics, m => m.kind === metric);

  return (
    <Card style={{ position: 'relative' }}>
      <ScrollAnchor behavior="smooth" top={-20} />
      <CardContent>
        <CostOverviewHeader title="Cloud Cost">
          <PeriodSelect duration={filters.duration} onSelect={setDuration} />
        </CostOverviewHeader>
        <Divider />
        <Box marginY={1} display="flex" flexDirection="column">
          <CostOverviewChartLegend change={change} title={`${name} Trend`} />
          <CostOverviewChart
            responsive
            metric={metric}
            tooltip={name}
            aggregation={aggregation}
            trendline={trendline}
          />
        </Box>
        <Box display="flex" justifyContent="flex-end" alignItems="center">
          <MetricSelect
            metric={metric}
            metrics={metrics}
            onSelect={setMetric}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default CostOverviewCard;
