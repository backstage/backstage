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
import CostOverviewChart from './CostOverviewChart';
import CostOverviewHeader from './CostOverviewHeader';
import LegendItem from '../LegendItem';
import MetricSelect from '../MetricSelect';
import PeriodSelect from '../PeriodSelect';
import { useScroll, useFilters, useConfig } from '../../hooks';
import { mapFiltersToProps } from './selector';
import { DefaultNavigation } from '../../utils/navigation';
import { formatPercent } from '../../utils/formatters';
import {
  Cost,
  CostInsightsTheme,
  MetricData,
  findAlways,
  getComparedChange,
} from '../../types';

export type CostOverviewCardProps = {
  data: [Cost, MetricData | null];
};

const CostOverviewCard = ({ data }: CostOverviewCardProps) => {
  const theme = useTheme<CostInsightsTheme>();
  const config = useConfig();
  const { ScrollAnchor } = useScroll(DefaultNavigation.CostOverviewCard);
  const { setDuration, setProject, setMetric, ...filters } = useFilters(
    mapFiltersToProps,
  );

  // There should always be a daily cost metric but a comparison metric is optional.
  const dailyCost = findAlways(config.metrics, m => m.kind === null);
  const metric = config.metrics.find(m => m.kind === filters.metric);
  const comparedChange = data[1] ? getComparedChange(data[0], data[1]) : null;

  return (
    <Card style={{ position: 'relative' }}>
      <ScrollAnchor behavior="smooth" top={-20} />
      <CardContent>
        <CostOverviewHeader title="Cloud Cost">
          <PeriodSelect duration={filters.duration} onSelect={setDuration} />
        </CostOverviewHeader>
        <Divider />
        <Box my={1} display="flex" flexDirection="column">
          <Box display="flex" flexDirection="row">
            <Box mr={2}>
              <LegendItem
                title={`${dailyCost.name} Trend`}
                markerColor={theme.palette.blue}
              >
                {formatPercent(data[0].change.ratio)}
              </LegendItem>
            </Box>
            {metric && metric.kind && data[1] && comparedChange && (
              <>
                <Box mr={2}>
                  <LegendItem
                    title={metric.name}
                    markerColor={theme.palette.magenta}
                  >
                    {formatPercent(data[1].change.ratio)}
                  </LegendItem>
                </Box>
                <LegendItem
                  title={
                    comparedChange.amount <= 0 ? 'Your Savings' : 'Your Excess'
                  }
                >
                  <CostGrowth
                    change={comparedChange}
                    duration={filters.duration}
                  />
                </LegendItem>
              </>
            )}
          </Box>
          <CostOverviewChart
            data={data}
            name={dailyCost.name}
            compare={metric}
          />
        </Box>
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
