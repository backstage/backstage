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

import React, { FC } from 'react';
import { Grid, Typography } from '@material-ui/core';

import { HorizontalScrollGrid, ProgressCard } from '@spotify-backstage/core';

const SquadTechHealth: FC<{}> = () => {
  return (
    <>
      <Typography variant="h3">Team Metrics</Typography>
      <HorizontalScrollGrid scrollStep={400} scrollSpeed={100}>
        <Grid item>
          <ProgressCard
            title="Test Certified"
            progress={0.23}
            deepLink={{
              link: '/some-url',
              title: 'About Test Certs',
            }}
          />
        </Grid>
        <Grid item>
          <ProgressCard
            title="k8s Migration"
            progress={0.78}
            deepLink={{
              link: '/some-url',
              title: 'About k8s',
            }}
          />
        </Grid>
      </HorizontalScrollGrid>
    </>
  );
};

export default SquadTechHealth;
