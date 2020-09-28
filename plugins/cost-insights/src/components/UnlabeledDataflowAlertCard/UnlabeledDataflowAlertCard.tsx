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
import UnlabeledDataflowBarChart from '../UnlabeledDataflowBarChart';
import UnlabeledDataflowBarChartLegend from '../UnlabeledDataflowBarChartLegend';
import { UnlabeledDataflowAlert } from '../../types';
import { pluralOf } from '../../utils/grammar';

type UnlabeledDataflowAlertProps = {
  alert: UnlabeledDataflowAlert;
};

const UnlabeledDataflowAlertCard = ({ alert }: UnlabeledDataflowAlertProps) => {
  const projects = pluralOf(alert.projects.length, 'project');
  const subheader = `
    Showing costs from ${alert.projects.length} ${projects} with unlabeled Dataflow jobs in the last 30 days.
  `;
  return (
    <InfoCard title="Label Dataflow" subheader={subheader}>
      <Box display="flex" flexDirection="column">
        <Box paddingY={1}>
          <UnlabeledDataflowBarChartLegend
            unlabeledCost={alert.unlabeledCost}
            labeledCost={alert.labeledCost}
          />
        </Box>
        <Box paddingY={1}>
          <UnlabeledDataflowBarChart projects={alert.projects} />
        </Box>
      </Box>
    </InfoCard>
  );
};

export default UnlabeledDataflowAlertCard;
