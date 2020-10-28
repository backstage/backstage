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

import React, { useState, useCallback } from 'react';
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ContentRenderer,
  TooltipProps,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  TooltipPayload,
} from 'recharts';
import { Box, useTheme } from '@material-ui/core';
import { BarChartTick } from './BarChartTick';
import { BarChartStepper } from './BarChartStepper';
import { Tooltip, TooltipItemProps } from '../Tooltip';

import { currencyFormatter } from '../../utils/formatters';
import {
  BarChartData,
  Maybe,
  notEmpty,
  ResourceData,
  DataKey,
  CostInsightsTheme,
} from '../../types';
import { useBarChartStyles } from '../../utils/styles';
import { resourceSort } from '../../utils/sort';

export type BarChartProps = {
  responsive?: boolean;
  displayAmount?: number;
  barChartData: BarChartData;
  getTooltipItem: (payload: TooltipPayload) => Maybe<TooltipItemProps>;
  resources: ResourceData[];
};

export const BarChart = ({
  responsive = true,
  displayAmount = 6,
  barChartData,
  getTooltipItem,
  resources,
}: BarChartProps) => {
  const theme = useTheme<CostInsightsTheme>();
  const styles = useBarChartStyles(theme);
  const [activeChart, setActiveChart] = useState(false);
  const [stepWindow, setStepWindow] = useState(() => [0, displayAmount]);

  const { previousFill, currentFill, previousName, currentName } = barChartData;

  const [stepStart, stepEnd] = stepWindow;
  const steps = Math.ceil(resources.length / displayAmount);
  const disableStepper = resources.length <= displayAmount;

  const sortedResources = resources
    .sort(resourceSort)
    .slice(stepStart, stepEnd);

  // Pin the domain to the largest value in the series.
  // Intentially redundant - This could simply be derived from the first element in the already sorted list,
  // but that may not be the case in the future when custom sorting is implemented.
  const globalResourcesMax = resources.reduce(
    (max, r: ResourceData) => Math.max(max, r.current, r.previous),
    0,
  );

  const onStepChange = useCallback(
    (activeStep: number) => {
      const start = activeStep * displayAmount;
      const end = start + displayAmount;
      if (end > resources.length) {
        setStepWindow([start, resources.length]);
      } else {
        setStepWindow([start, end]);
      }
    },
    [setStepWindow, resources, displayAmount],
  );

  const handleChartEnter = () => setActiveChart(true);

  const handleChartLeave = () => setActiveChart(false);

  const renderTooltipContent: ContentRenderer<TooltipProps> = ({
    label,
    payload,
  }) => {
    if (!(payload && typeof label === 'string')) return [null, null];
    const items = payload.map(getTooltipItem).filter(notEmpty);
    return <Tooltip label={label} items={items} />;
  };

  return (
    <Box
      position="relative"
      onMouseLeave={handleChartLeave}
      onMouseEnter={handleChartEnter}
      data-testid="bar-chart-wrapper"
    >
      {/* Setting fixed values for height and width generates a console warning in testing but enables ResponsiveContainer to render its children. */}
      <ResponsiveContainer
        height={styles.container.height}
        width={responsive ? '100%' : styles.container.width}
      >
        <RechartsBarChart
          data={sortedResources}
          margin={styles.barChart.margin}
          barSize={45}
          data-testid="bar-chart"
        >
          <RechartsTooltip
            cursor={styles.cursor}
            animationDuration={100}
            content={renderTooltipContent}
          />
          <CartesianGrid
            vertical={false}
            stroke={styles.cartesianGrid.stroke}
          />
          <XAxis
            dataKey={DataKey.Name}
            tickLine={false}
            interval={0}
            height={styles.xAxis.height}
            tick={BarChartTick}
          />
          <YAxis
            tickFormatter={currencyFormatter.format}
            domain={[() => 0, globalResourcesMax]}
            tick={{ fill: styles.axis.fill }}
          />
          <Bar
            dataKey={DataKey.Previous}
            name={previousName}
            fill={previousFill}
            isAnimationActive={false}
          />
          <Bar
            dataKey={DataKey.Current}
            name={currentName}
            fill={currentFill}
            isAnimationActive={false}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
      {!disableStepper && (
        <BarChartStepper
          steps={steps}
          disableScroll={!activeChart}
          onChange={onStepChange}
        />
      )}
    </Box>
  );
};
