/*
 * Copyright 2023 The Backstage Authors
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
import { wrapInTestApp } from '@backstage/test-utils';
import { ComponentType, PropsWithChildren } from 'react';
import { Grid } from '@material-ui/core';
import { HomePageRecentlyVisited } from '../../plugin';

export default {
  title: 'Plugins/Home/Components/RecentlyVisited',
  decorators: [
    (Story: ComponentType<PropsWithChildren<{}>>) => wrapInTestApp(<Story />),
  ],
};

export const Default = () => {
  return (
    <Grid item xs={12} md={6}>
      <HomePageRecentlyVisited />
    </Grid>
  );
};
