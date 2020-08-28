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
import { ProgressCard } from './ProgressCard';
import { Grid } from '@material-ui/core';

const linkInfo = { title: 'Go to XYZ Location', link: '#' };

export default {
  title: 'Progress Card',
  component: ProgressCard,
};

export const Default = () => (
  <Grid container spacing={2}>
    <Grid item>
      <ProgressCard title="Progress" progress={0.3} />
    </Grid>
    <Grid item>
      <ProgressCard title="Progress" progress={0.57} />
    </Grid>
    <Grid item>
      <ProgressCard title="Progress" progress={0.89} />
    </Grid>
  </Grid>
);

export const Subhead = () => (
  <Grid container spacing={2}>
    <Grid item>
      <ProgressCard
        title="Progress"
        subheader="With a subheader"
        progress={0.3}
      />
    </Grid>
    <Grid item>
      <ProgressCard
        title="Progress"
        subheader="With a subheader"
        progress={0.57}
      />
    </Grid>
    <Grid item>
      <ProgressCard
        title="Progress"
        subheader="With a subheader"
        progress={0.89}
      />
    </Grid>
  </Grid>
);

export const LinkInFooter = () => (
  <Grid container spacing={2}>
    <Grid item>
      <ProgressCard title="Progress" deepLink={linkInfo} progress={0.3} />
    </Grid>
    <Grid item>
      <ProgressCard title="Progress" deepLink={linkInfo} progress={0.57} />
    </Grid>
    <Grid item>
      <ProgressCard title="Progress" deepLink={linkInfo} progress={0.89} />
    </Grid>
  </Grid>
);
