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
import { Burst } from '.';
import { pageTheme } from '../Page';
import { Grid, Typography } from '@material-ui/core';

export default {
  title: 'Burst',
  component: Burst,
};

export const Default = () => (
  <div style={{ width: 300, height: 100, position: 'relative' }}>
    <Burst type="service" />
  </div>
);

export const AllTypes = ({}) => (
  <Grid container spacing={4}>
    {Object.keys(pageTheme).map(type => (
      <Grid item key={type} xs={3}>
        <div style={{ position: 'relative', height: 100 }}>
          <Typography
            variant="h4"
            style={{
              display: 'flex',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              position: 'absolute',
              zIndex: 100,
              color: 'white',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {type}
          </Typography>
          <Burst type={type} />
        </div>
      </Grid>
    ))}
  </Grid>
);
