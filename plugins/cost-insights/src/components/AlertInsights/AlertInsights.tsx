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
import { Grid } from '@material-ui/core';
import { AlertInsightsSection } from './AlertInsightsSection';
import { AlertInsightsHeader } from './AlertInsightsHeader';
import { Alert } from '../../types';

const title = "Your team's action items";
const subtitle =
  'This section outlines suggested action items your team can address to improve cloud costs.';

type AlertInsightsProps = {
  alerts: Array<Alert>;
};

export const AlertInsights = ({ alerts }: AlertInsightsProps) => (
  <Grid container direction="column" spacing={2}>
    <Grid item>
      <AlertInsightsHeader title={title} subtitle={subtitle} />
    </Grid>
    <Grid item container direction="column" spacing={4}>
      {alerts.map((alert, index) => (
        <Grid item key={`alert-card-${index}`}>
          <AlertInsightsSection alert={alert} number={index + 1} />
        </Grid>
      ))}
    </Grid>
  </Grid>
);
