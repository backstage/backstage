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
import { useTheme } from '@material-ui/core';
import {
  AxisDomain,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  Line,
  ResponsiveContainer,
  TooltipPayload,
} from 'recharts';
import {
  ChartData,
  Cost,
  Metric,
  MetricData,
  CostInsightsTheme,
} from '../../types';
import {
  overviewGraphTickFormatter,
  formatGraphValue,
} from '../../utils/graphs';
import CostOverviewTooltip from './CostOverviewTooltip';
import { TooltipItemProps } from '../Tooltip';
import { NULL_METRIC } from '../../hooks/useConfig';
import { useCostOverviewStyles as useStyles } from '../../utils/styles';
import { groupByDate, toDataMax, trendFrom } from '../../utils/charts';
import { aggregationSort } from '../../utils/sort';

type CostOverviewChartProps = {
  data: [Cost, MetricData | null];
  name: string;
  compare?: Metric;
  responsive?: boolean;
};

const CostOverviewChart = ({
  data,
  name,
  compare,
  responsive = true,
}: CostOverviewChartProps) => {
  const theme = useTheme<CostInsightsTheme>();
  const styles = useStyles(theme);

  const { dailyCost, metric } = {
    dailyCost: {
      id: NULL_METRIC,
      name: name,
      format: 'number',
      data: data[0],
    },
    metric: {
      id: compare?.kind ?? 'Unknown',
      name: compare?.name ?? 'Unknown',
      format: data[1]?.format ?? 'number',
      data: data[1],
    },
  };

  const metricsByDate = metric.data
    ? metric.data.aggregation.reduce(groupByDate, {})
    : {};

  const chartData: ChartData[] = dailyCost
    .data!.aggregation.slice()
    .sort(aggregationSort)
    .map(entry => ({
      date: Date.parse(entry.date),
      trend: trendFrom(dailyCost.data!.trendline, Date.parse(entry.date)),
      dailyCost: entry.amount,
      ...(metric && metric.data
        ? { [metric.id]: metricsByDate[`${entry.date}`] }
        : {}),
    }));

  const metricDataMax: AxisDomain = metric
    ? toDataMax(metric.id, chartData)
    : 'dataMax';

  function tooltipFormatter(payload: TooltipPayload): TooltipItemProps {
    return {
      label: payload.dataKey === dailyCost.id ? dailyCost.name : metric.name,
      value:
        payload.dataKey === dailyCost.id
          ? formatGraphValue(payload.value as number, dailyCost.format)
          : formatGraphValue(payload.value as number, metric.format),
      fill:
        payload.dataKey === dailyCost.id
          ? theme.palette.blue
          : theme.palette.magenta,
    };
  }

  return (
    <ResponsiveContainer
      width={responsive ? '100%' : styles.container.width}
      height={styles.container.height}
      className="cost-overview-chart"
    >
      <ComposedChart margin={styles.chart.margin} data={chartData}>
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
          yAxisId={dailyCost.id}
        />
        {metric && (
          <YAxis
            hide
            domain={[() => 0, metricDataMax]}
            width={styles.yAxis.width}
            yAxisId={metric.id}
          />
        )}
        <Area
          dataKey={dailyCost.id}
          isAnimationActive={false}
          fill={theme.palette.blue}
          fillOpacity={0.4}
          stroke="none"
          yAxisId={dailyCost.id}
        />
        <Line
          activeDot={false}
          dataKey="trend"
          dot={false}
          isAnimationActive={false}
          label={false}
          strokeWidth={2}
          stroke={theme.palette.blue}
          yAxisId={dailyCost.id}
        />
        {metric && (
          <Line
            activeDot={false}
            dataKey={metric.id}
            dot={false}
            isAnimationActive={false}
            label={false}
            strokeWidth={2}
            stroke={theme.palette.magenta}
            yAxisId={metric.id}
          />
        )}
        <Tooltip
          content={
            <CostOverviewTooltip
              dataKeys={[dailyCost.id, metric.id]}
              format={tooltipFormatter}
            />
          }
          animationDuration={100}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default CostOverviewChart;
