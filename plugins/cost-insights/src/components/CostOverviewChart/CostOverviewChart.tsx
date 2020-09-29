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
import {
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  Line,
  ResponsiveContainer,
} from 'recharts';
import {
  Maybe,
  DateAggregation,
  Trendline,
  CostInsightsTheme,
} from '../../types';
import {
  overviewGraphTickFormatter,
  formatGraphValue,
} from '../../utils/graphs';
import CostOverviewTooltip from './CostOverviewTooltip';
import { useTheme } from '@material-ui/core';
import { useCostOverviewStyles as useStyles } from '../../utils/styles';
import { NULL_METRIC } from '../../hooks/useConfig';

type CostOverviewChartProps = {
  responsive: boolean;
  aggregation: Array<DateAggregation>;
  trendline?: Maybe<Trendline>;
  metric: string | null;
  tooltip: string;
};

const CostOverviewChart = ({
  responsive = true,
  aggregation,
  trendline,
  metric,
  tooltip,
}: CostOverviewChartProps) => {
  const theme = useTheme<CostInsightsTheme>();
  const styles = useStyles(theme);

  const id = metric ? metric : NULL_METRIC;

  const dailyCostData = aggregation.map((entry: DateAggregation) => ({
    date: Date.parse(entry.date),
    [id]: entry.amount,
    trend: trendline
      ? trendline.slope * (Date.parse(entry.date) / 1000) + trendline.intercept
      : null,
  }));

  return (
    <ResponsiveContainer
      width={responsive ? '100%' : styles.container.width}
      height={styles.container.height}
      className="cost-overview-chart"
    >
      <ComposedChart margin={styles.chart.margin} data={dailyCostData}>
        <CartesianGrid stroke={styles.cartesianGrid.stroke} />
        <XAxis
          dataKey="date"
          domain={['dataMin', 'dataMax']}
          tickFormatter={overviewGraphTickFormatter}
          tickCount={6}
          type="number"
          stroke={styles.axis.fill}
        />
        <YAxis
          domain={[() => 0, 'dataMax']}
          tick={{ fill: styles.axis.fill }}
          tickFormatter={formatGraphValue}
          width={styles.yAxis.width}
          yAxisId={id}
        />
        <Area
          dataKey={id}
          isAnimationActive={false}
          fill={theme.palette.blue}
          fillOpacity={0.4}
          stroke="none"
          yAxisId={id}
        />
        <Line
          activeDot={false}
          dataKey="trend"
          dot={false}
          isAnimationActive={false}
          label={false}
          strokeWidth={2}
          stroke={theme.palette.blue}
          yAxisId={id}
        />
        <Tooltip
          content={<CostOverviewTooltip name={tooltip} metric={id} />}
          animationDuration={100}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default CostOverviewChart;
