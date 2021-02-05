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
import { Box } from '@material-ui/core';
import { InfoCard } from '@backstage/core';
import { MigrationBarChartLegend } from './MigrationBarChartLegend';
import { MigrationBarChart } from './MigrationBarChart';
import { MigrationData } from '../../alerts';

type MigrationAlertProps = {
  data: MigrationData;
  title: string;
  subheader: string;
  currentProduct: string;
  comparedProduct: string;
};

export const MigrationAlertCard = ({
  data,
  title,
  subheader,
  currentProduct,
  comparedProduct,
}: MigrationAlertProps) => {
  return (
    <InfoCard title={title} subheader={subheader}>
      <Box display="flex" flexDirection="column">
        <Box paddingY={1}>
          <MigrationBarChartLegend
            startDate={data.startDate}
            change={data.change}
            currentProduct={currentProduct}
            comparedProduct={comparedProduct}
          />
        </Box>
        <Box paddingY={1}>
          <MigrationBarChart
            services={data.services}
            currentProduct={currentProduct}
            comparedProduct={comparedProduct}
          />
        </Box>
      </Box>
    </InfoCard>
  );
};
