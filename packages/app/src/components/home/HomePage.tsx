/*
 * Copyright 2021 The Backstage Authors
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
import Grid from '@material-ui/core/Grid';
import {
  HomePageRandomJoke,
  ComponentAccordion,
  ComponentTabs,
  ComponentTab,
} from '@backstage/plugin-home';
import { HomePageSearchBar } from '@backstage/plugin-search';
import { HomePageStarredEntities } from '@backstage/plugin-catalog';

export const HomePage = () => (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <HomePageSearchBar />
    </Grid>
    <Grid item xs={12} md={4}>
      <HomePageRandomJoke />
    </Grid>
    <Grid item xs={12} md={4}>
      <HomePageStarredEntities />
    </Grid>
    <Grid item xs={12} md={4}>
      <HomePageRandomJoke defaultCategory="any" Renderer={ComponentAccordion} />
      <HomePageRandomJoke
        title="Another Random Joke"
        Renderer={ComponentAccordion}
      />
      <HomePageRandomJoke
        title="One More Random Joke"
        defaultCategory="programming"
        Renderer={ComponentAccordion}
      />
    </Grid>
    <Grid item xs={12} md={4}>
      <ComponentTabs
        title="Random Jokes"
        tabs={[
          {
            label: 'Programming',
            Component: () => (
              <HomePageRandomJoke
                defaultCategory="programming"
                Renderer={ComponentTab}
              />
            ),
          },
          {
            label: 'Any',
            Component: () => (
              <HomePageRandomJoke
                defaultCategory="any"
                Renderer={ComponentTab}
              />
            ),
          },
        ]}
      />
    </Grid>
  </Grid>
);
