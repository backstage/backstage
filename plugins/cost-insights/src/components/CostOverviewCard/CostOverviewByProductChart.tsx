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
import React, { useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {
  useTheme,
  Box,
  Typography,
  Divider,
  emphasize,
} from '@material-ui/core';
import { default as FullScreenIcon } from '@material-ui/icons/Fullscreen';
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
  const classes = useStyles(theme);
  const lastCompleteBillingDate = useLastCompleteBillingDate();
  const { duration } = useFilters(mapFiltersToProps);
  const [isExpanded, setExpanded] = useState(false);

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
  const otherProducts: string[] = [];

  const productsByDate = costsByProduct.reduce((prodByDate, product) => {
    const productTotal = aggregationSum(product.aggregation);
    // Group products with less than 10% of the total cost into "Other" category
    // when we have >= 8 products.
    const isOtherProduct =
      costsByProduct.length >= 8 &&
      productTotal < totalCost * LOW_COST_THRESHOLD;

    const updatedProdByDate = { ...prodByDate };
    if (isOtherProduct) {
      otherProducts.push(product.id);
    }
    product.aggregation.forEach(curAggregation => {
      const productCostsForDate = updatedProdByDate[curAggregation.date] || {};

      updatedProdByDate[curAggregation.date] = {
        ...productCostsForDate,
        [product.id]:
          (productCostsForDate[product.id] || 0) + curAggregation.amount,
      };
    });

    return updatedProdByDate;
  }, {} as Record<string, Record<string, number>>);

  const chartData: Record<string, number>[] = Object.keys(productsByDate).map(
    date => {
      const costsForDate = Object.keys(productsByDate[date]).reduce(
        (dateCosts, product) => {
          // Group costs for products that belong to 'Other' in the chart.
          const cost = productsByDate[date][product];
          const productCost =
            !isExpanded && otherProducts.includes(product)
              ? { Other: (dateCosts.Other || 0) + cost }
              : { [product]: cost };
          return { ...dateCosts, ...productCost };
        },
        {} as Record<string, number>,
      );
      return {
        ...costsForDate,
        date: Date.parse(date),
      };
    },
  );

  const sortedProducts = costsByProduct.sort(
    (a, b) => aggregationSum(a.aggregation) - aggregationSum(b.aggregation),
  );

  const renderAreas = () => {
    const separatedProducts = sortedProducts
      // Check that product is a separate group and hasn't been added to 'Other'
      .filter(
        product =>
          product.id !== 'Other' && !otherProducts.includes(product.id),
      )
      .map(product => product.id);
    // Keep 'Other' category at the bottom of the stack
    const productsToDisplay = isExpanded
      ? sortedProducts.map(product => product.id)
      : ['Other', ...separatedProducts];

    return productsToDisplay.map((product, i) => {
      // Logic to handle case where there are more products than data viz colors.
      const productColor =
        theme.palette.dataViz[
          (productsToDisplay.length - 1 - i) %
            (theme.palette.dataViz.length - 1)
        ];
      return (
        <Area
          dataKey={product}
          isAnimationActive={false}
          stackId="1"
          stroke={productColor}
          fill={productColor}
          onClick={() => setExpanded(true)}
          style={{
            cursor: product === 'Other' && !isExpanded ? 'pointer' : null,
          }}
        />
      );
    });
  };

  const tooltipRenderer: ContentRenderer<TooltipProps> = ({
    label,
    payload = [],
  }) => {
    if (isInvalid({ label, payload })) return null;

    const dateTitle = dayjs(label).utc().format(DEFAULT_DATE_FORMAT);
    const items = payload.map(p => ({
      label: p.dataKey as string,
      value: formatGraphValue(p.value as number),
      fill: p.fill!,
    }));
    const expandText = (
      <Box>
        <Divider
          style={{
            backgroundColor: emphasize(theme.palette.divider, 1),
            margin: '10px 0',
          }}
        />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <FullScreenIcon />
          <Typography>Click to expand</Typography>
        </Box>
      </Box>
    );
    return (
      <Tooltip title={dateTitle}>
        {items.reverse().map((item, index) => (
          <TooltipItem key={`${item.label}-${index}`} item={item} />
        ))}
        {!isExpanded ? expandText : null}
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
        width={classes.container.width}
        height={classes.container.height}
      >
        <AreaChart
          data={chartData}
          margin={{
            top: 16,
            right: 30,
            bottom: 40,
          }}
        >
          <CartesianGrid stroke={classes.cartesianGrid.stroke} />
          <XAxis
            dataKey="date"
            domain={['dataMin', 'dataMax']}
            tickFormatter={overviewGraphTickFormatter}
            tickCount={6}
            type="number"
            stroke={classes.axis.fill}
          />
          <YAxis
            domain={[() => 0, 'dataMax']}
            tick={{ fill: classes.axis.fill }}
            tickFormatter={formatGraphValue}
            width={classes.yAxis.width}
          />
          {renderAreas()}
          <RechartsTooltip content={tooltipRenderer} animationDuration={100} />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};
