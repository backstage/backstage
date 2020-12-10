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
  BarChartLegend,
} from '../BarChart';
import {
  overviewGraphTickFormatter,
  formatGraphValue,
  isInvalid,
} from '../../utils/graphs';
import { useCostOverviewStyles as useStyles } from '../../utils/styles';
import { useFilters, useLastCompleteBillingDate } from '../../hooks';
import { mapFiltersToProps } from './selector';
import { getPreviousPeriodTotalCost } from '../../utils/change';
import { formatPeriod } from '../../utils/formatters';
import { aggregationSum } from '../../utils/sum';
import { BarChartLegendOptions } from '../BarChart/BarChartLegend';

dayjs.extend(utc);

export type CostOverviewByProductChartProps = {
  costsByProduct: Cost[];
};

const LOW_COST_THRESHOLD = 0.1;

export const CostOverviewByProductChart = ({
  costsByProduct,
}: CostOverviewByProductChartProps) => {
  const theme = useTheme<CostInsightsTheme>();
  const styles = useStyles(theme);
  const lastCompleteBillingDate = useLastCompleteBillingDate();
  const { duration } = useFilters(mapFiltersToProps);

  if (!costsByProduct) {
    return null;
  }

  const flattenedAggregation = costsByProduct
    .map(cost => cost.aggregation)
    .flat();

  const totalCost = aggregationSum(flattenedAggregation);

  const previousPeriodTotal = getPreviousPeriodTotalCost(
    flattenedAggregation,
    duration,
    lastCompleteBillingDate,
  );
  const currentPeriodTotal = totalCost - previousPeriodTotal;
  const productsByDate = costsByProduct.reduce((prodByDate, product) => {
    const productTotal = aggregationSum(product.aggregation);
    // Group products with less than 10% of the total cost into "Other" category
    // when there we have >= 5 products.
    const isOtherProduct =
      costsByProduct.length >= 5 &&
      productTotal < totalCost * LOW_COST_THRESHOLD;
    const productName = isOtherProduct ? 'Other' : product.id;
    const updatedProdByDate = { ...prodByDate };

    product.aggregation.forEach(curAggregation => {
      const productCostsForDate = updatedProdByDate[curAggregation.date] || {};

      updatedProdByDate[curAggregation.date] = {
        ...productCostsForDate,
        [productName]:
          (productCostsForDate[productName] || 0) + curAggregation.amount,
      };
    });

    return updatedProdByDate;
  }, {} as Record<string, Record<string, number>>);

  const chartData: Record<string, number>[] = Object.keys(productsByDate).map(
    date => {
      return {
        ...productsByDate[date],
        date: Date.parse(date),
      };
    },
  );

  const renderAreas = () => {
    const productGroupNames = new Set(
      Object.values(productsByDate)
        .map(d => Object.keys(d))
        .flat(),
    );
    const sortedProducts = costsByProduct
      // Check that product is a separate group and hasn't been added to 'Other'
      .filter(
        product => product.id !== 'Other' && productGroupNames.has(product.id),
      )
      .sort(
        (a, b) => aggregationSum(a.aggregation) - aggregationSum(b.aggregation),
      )
      .map(product => product.id);
    // Keep 'Other' category at the bottom of the stack
    return ['Other', ...sortedProducts].map((product, i) => (
      <Area
        dataKey={product}
        isAnimationActive={false}
        stackId="1"
        stroke={theme.palette.dataViz[sortedProducts.length - i]}
        fill={theme.palette.dataViz[sortedProducts.length - i]}
      />
    ));
  };

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

  const options: Partial<BarChartLegendOptions> = {
    previousName: formatPeriod(duration, lastCompleteBillingDate, false),
    currentName: formatPeriod(duration, lastCompleteBillingDate, true),
    hideMarker: true,
  };

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" flexDirection="row">
        <BarChartLegend
          costStart={previousPeriodTotal}
          costEnd={currentPeriodTotal}
          options={options}
        />
      </Box>
      <ResponsiveContainer
        width={styles.container.width}
        height={styles.container.height}
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
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};
