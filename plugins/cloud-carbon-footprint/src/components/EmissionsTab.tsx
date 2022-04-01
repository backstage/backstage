/*
 * Copyright 2022 The Backstage Authors
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
import { CardTab, Progress, TabbedCard } from '@backstage/core-components';
import {
  CarbonComparisonCard,
  EmissionsBreakdownCard,
  EmissionsFilterBar,
  EmissionsOverTimeCard,
  useFootprintData,
} from '@cloud-carbon-footprint/client';
import { Grid } from '@material-ui/core';

export const EmissionsTab = ({
  footprint,
  baseUrl,
}: {
  footprint: ReturnType<typeof useFootprintData>;
  baseUrl: string;
}) => (
  <Grid container spacing={3} direction="column">
    <Grid item>
      <EmissionsFilterBar {...footprint.filterBarProps} />
      {footprint.loading && <Progress />}
    </Grid>
    <Grid item>
      <TabbedCard title="Estimated Emissions">
        <CardTab label="Cloud Usage">
          <EmissionsOverTimeCard data={footprint.filteredData} />
        </CardTab>
        <CardTab label="Breakdown">
          <Grid container direction="row" spacing={3}>
            <CarbonComparisonCard data={footprint.filteredData} />
            <EmissionsBreakdownCard
              data={footprint.filteredData}
              baseUrl={baseUrl}
            />
          </Grid>
        </CardTab>
      </TabbedCard>
    </Grid>
  </Grid>
);
