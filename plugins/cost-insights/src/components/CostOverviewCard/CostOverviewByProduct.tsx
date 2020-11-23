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
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useTheme, Box } from '@material-ui/core';
import {
  AreaChart,
  ContentRenderer,
  TooltipProps,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Area,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Cost, DEFAULT_DATE_FORMAT, CostInsightsTheme } from '../../types';
import {
  BarChartTooltip as Tooltip,
  BarChartTooltipItem as TooltipItem,
} from '../BarChart';
import {
  overviewGraphTickFormatter,
  formatGraphValue,
  isInvalid,
} from '../../utils/graphs';
import {
  useCostOverviewStyles as useStyles,
  DataVizColors,
} from '../../utils/styles';
import { useFilters, useLastCompleteBillingDate } from '../../hooks';
import { mapFiltersToProps } from './selector';
import { getPreviousPeriodTotalCost } from '../../utils/change';
import { LegendItem } from '../LegendItem';
import { currencyFormatter } from '../../utils/formatters';
import { aggregationSum } from '../../utils/sum';

dayjs.extend(utc);

export type CostOverviewByProductProps = {
  dailyCostData: Cost;
};

const LOW_COST_THRESHOLD = 0.01;

export const CostOverviewByProduct = ({
  dailyCostData,
}: CostOverviewByProductProps) => {
  const theme = useTheme<CostInsightsTheme>();
  const styles = useStyles(theme);
  const lastCompleteBillingDate = useLastCompleteBillingDate();
  const { duration } = useFilters(mapFiltersToProps);
  const groupedCosts = dailyCostData.groupedCosts;

  if (!groupedCosts) {
    return null;
  }

  const flattenedAggregation = groupedCosts
    .map(cost => cost.aggregation)
    .flat();
  const totalCost = flattenedAggregation.reduce(
    (acc, agg) => acc + agg.amount,
    0,
  );

  const productsByDate = groupedCosts.reduce((prodByDate, group) => {
    const product = group.id;
    group.aggregation.forEach(curAggregation => {
      const productCostsForDate = prodByDate[curAggregation.date] || {};
      // Group products with less than 10% of the total cost into "Other" category
      if (aggregationSum(group.aggregation) < totalCost * LOW_COST_THRESHOLD) {
        prodByDate[curAggregation.date] = {
          ...productCostsForDate,
          Other:
            (prodByDate[curAggregation.date].Other || 0) +
            curAggregation.amount,
        };
      } else {
        prodByDate[curAggregation.date] = {
          ...productCostsForDate,
          [product]: curAggregation.amount,
        };
      }
    });

    return prodByDate;
  }, {} as Record<string, Record<string, number>>);

  const chartData: any[] = Object.keys(productsByDate).map(date => {
    return {
      ...productsByDate[date],
      date: Date.parse(date),
    };
  });

  const tooltipRenderer: ContentRenderer<TooltipProps> = ({
    label,
    payload = [],
  }) => {
    if (isInvalid({ label, payload })) return null;

    const title = dayjs(label).utc().format(DEFAULT_DATE_FORMAT);
    const items = payload.map(p => ({
      label: p.dataKey as string,
      value: formatGraphValue(p.value as number),
      fill: p.fill!,
    }));

    return (
      <Tooltip title={title}>
        {items.reverse().map((item, index) => (
          <TooltipItem key={`${item.label}-${index}`} item={item} />
        ))}
      </Tooltip>
    );
  };

  const previousPeriodTotal = getPreviousPeriodTotalCost(
    flattenedAggregation,
    duration,
    lastCompleteBillingDate,
  );
  const currentPeriodTotal = totalCost - previousPeriodTotal;

  const renderAreas = () => {
    const highCostGroups = groupedCosts.filter(
      group =>
        aggregationSum(group.aggregation) >= totalCost * LOW_COST_THRESHOLD,
    );
    const sortedCostGroups = highCostGroups
      .sort(
        (a, b) => aggregationSum(a.aggregation) - aggregationSum(b.aggregation),
      )
      .map(group => group.id);
    // Keep 'Other' category at the bottom of the stack
    return ['Other', ...sortedCostGroups].map((group, i) => (
      <Area
        dataKey={group}
        stackId="1"
        fillOpacity="1"
        stroke={DataVizColors[i]}
        fill={DataVizColors[i]}
      />
    ));
  };

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" flexDirection="row">
        <Box mr={3}>
          <LegendItem title="Previous Period">
            {currencyFormatter.format(previousPeriodTotal)}
          </LegendItem>
        </Box>
        <Box>
          <LegendItem title="Current Period">
            {currencyFormatter.format(currentPeriodTotal)}
          </LegendItem>
        </Box>
      </Box>
      <ResponsiveContainer
        width={styles.container.width}
        height={styles.container.height}
        className="cost-overview-chart"
      >
        <AreaChart
          data={chartData}
          margin={{
            top: 16,
            right: 30,
            bottom: 40,
          }}
        >
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
          />
          {renderAreas()}
          <RechartsTooltip content={tooltipRenderer} animationDuration={100} />
          <RechartsTooltip />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};
