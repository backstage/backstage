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
import { GaugeCard } from '@backstage/core';

export const MemberStatistics = () => {
  return (
    <Grid container spacing={0}>
      <Grid item xs={6} md={4} xl={3}>
        <GaugeCard
          title="Example Chart #1"
          subheader="This should be above 75%"
          progress={0.87}
        />
      </Grid>
      <Grid item xs={6} md={4} xl={3}>
        <GaugeCard
          title="Example Chart #2"
          subheader="This should be above 75%"
          progress={0.5}
        />
      </Grid>
      <Grid item xs={6} md={4} xl={3}>
        <GaugeCard
          title="Example Chart #3"
          subheader="This should be above 75%"
          progress={0.25}
        />
      </Grid>
      <Grid item xs={6} md={4} xl={3}>
        <GaugeCard
          title="Example Chart #4"
          subheader="This should be above 75%"
          progress={0}
        />
      </Grid>
    </Grid>
  );
};
