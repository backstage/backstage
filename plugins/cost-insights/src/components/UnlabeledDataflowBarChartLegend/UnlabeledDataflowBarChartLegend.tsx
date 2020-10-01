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
import { currencyFormatter } from '../../utils/formatters';
import { CostInsightsTheme } from '../../types';

type UnlabeledDataflowBarChartLegendProps = {
  labeledCost: number;
  unlabeledCost: number;
};

const UnlabeledDataflowBarChartLegend = ({
  unlabeledCost,
  labeledCost,
}: UnlabeledDataflowBarChartLegendProps) => {
  const theme = useTheme<CostInsightsTheme>();
  return (
    <Box
      className="dataflow-label-chart-legend"
      display="flex"
      flexDirection="row"
    >
      <Box marginRight={2}>
        <LegendItem
          title="Total Unlabeled Cost"
          markerColor={theme.palette.lightBlue}
        >
          {currencyFormatter.format(unlabeledCost)}
        </LegendItem>
      </Box>
      <Box marginRight={2}>
        <LegendItem
          title="Total Labeled Cost"
          markerColor={theme.palette.darkBlue}
        >
          {currencyFormatter.format(labeledCost)}
        </LegendItem>
      </Box>
    </Box>
  );
};

export default UnlabeledDataflowBarChartLegend;
