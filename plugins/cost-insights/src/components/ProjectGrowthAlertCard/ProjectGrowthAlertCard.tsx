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
import ResourceGrowthBarChart from '../ResourceGrowthBarChart';
import ResourceGrowthBarChartLegend from '../ResourceGrowthBarChartLegend';
import { Duration, ProjectGrowthData } from '../../types';
import { pluralOf } from '../../utils/grammar';

type ProjectGrowthAlertProps = {
  alert: ProjectGrowthData;
};

const ProjectGrowthAlertCard = ({ alert }: ProjectGrowthAlertProps) => {
  const [costStart, costEnd] = alert.aggregation;

  const subheader = `
    ${alert.products.length} ${pluralOf(alert.products.length, 'product')}${
    alert.products.length > 1 ? ', sorted by cost' : ''
  }`;

  return (
    <InfoCard
      title={`Project growth for ${alert.project}`}
      subheader={subheader}
    >
      <Box display="flex" flexDirection="column">
        <Box pb={2}>
          <ResourceGrowthBarChartLegend
            change={alert.change}
            duration={Duration.P3M}
            costStart={costStart}
            costEnd={costEnd}
          />
        </Box>
        <ResourceGrowthBarChart
          resources={alert.products}
          duration={Duration.P3M}
        />
      </Box>
    </InfoCard>
  );
};

export default ProjectGrowthAlertCard;
