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
import { TestApiProvider, wrapInTestApp } from '@backstage/test-utils';
import { ComponentType, PropsWithChildren } from 'react';
import { Grid } from '@material-ui/core';
import { homePlugin } from '../../plugin';
import { Visit, visitsApiRef } from '../../api/VisitsApi';
import { createCardExtension } from '@backstage/plugin-home-react';
import { VisitedByTypeProps } from './Content';

const visits: Array<Visit> = [
  {
    id: 'tech-radar',
    name: 'Tech Radar',
    pathname: '/tech-radar',
    hits: 40,
    timestamp: Date.now() - 360_000,
  },
  {
    id: 'explore',
    name: 'Explore Backstage',
    pathname: '/explore',
    hits: 35,
    timestamp: Date.now() - 86400_000 * 1,
  },
  {
    id: 'user-1',
    name: 'Guest',
    pathname: '/catalog/default/user/guest',
    hits: 30,
    timestamp: Date.now() - 86400_000 * 2,
    entityRef: 'User:default/guest',
  },
  {
    id: 'audio-playback',
    name: 'Audio Playback',
    pathname: '/catalog/default/system/audio-playback',
    hits: 25,
    timestamp: Date.now() - 86400_000 * 3,
    entityRef: 'System:default/audio-playback',
  },
  {
    id: 'team-a',
    name: 'Team A',
    pathname: '/catalog/default/group/team-a',
    hits: 20,
    timestamp: Date.now() - 86400_000 * 4,
    entityRef: 'Group:default/team-a',
  },
  {
    id: 'playback-order',
    name: 'Playback Order',
    pathname: '/catalog/default/component/playback-order',
    hits: 15,
    timestamp: Date.now() - 86400_000 * 5,
    entityRef: 'Component:default/playback-order',
  },
  {
    id: 'playback',
    name: 'Playback',
    pathname: '/catalog/default/domain/playback',
    hits: 10,
    timestamp: Date.now() - 86400_000 * 6,
    entityRef: 'Domain:default/playback',
  },
  {
    id: 'hello-world',
    name: 'Hello World gRPC',
    pathname: '/catalog/default/api/hello-world',
    hits: 1,
    timestamp: Date.now() - 86400_000 * 7,
    entityRef: 'API:default/hello-world',
  },
];

const HomePageVisitedByType = homePlugin.provide(
  createCardExtension<VisitedByTypeProps>({
    name: 'HomePageTopVisited',
    components: () => import('./'),
  }),
);

const mockVisitsApi = {
  save: async () => visits[0],
  list: async () => visits,
};

export default {
  title: 'Plugins/Home/Components/VisitedByType',
  decorators: [
    (Story: ComponentType<PropsWithChildren<{}>>) =>
      wrapInTestApp(
        <TestApiProvider apis={[[visitsApiRef, mockVisitsApi]]}>
          <Story />
        </TestApiProvider>,
      ),
  ],
};

export const RecentlyDefault = () => {
  return (
    <Grid item xs={12} md={6}>
      <HomePageVisitedByType kind="recent" />
    </Grid>
  );
};

export const RecentlyEmpty = () => {
  return (
    <Grid item xs={12} md={6}>
      <HomePageVisitedByType kind="recent" visits={[]} />
    </Grid>
  );
};

export const RecentlyFewItems = () => {
  return (
    <Grid item xs={12} md={6}>
      <HomePageVisitedByType kind="recent" visits={visits.slice(0, 1)} />
    </Grid>
  );
};

export const RecentlyMoreItems = () => {
  return (
    <Grid item xs={12} md={6}>
      <HomePageVisitedByType
        kind="recent"
        numVisitsOpen={5}
        numVisitsTotal={6}
      />
    </Grid>
  );
};

export const RecentlyLoading = () => {
  return (
    <Grid item xs={12} md={6}>
      <HomePageVisitedByType
        kind="recent"
        numVisitsOpen={5}
        numVisitsTotal={6}
        loading
      />
    </Grid>
  );
};

export const TopDefault = () => {
  return (
    <Grid item xs={12} md={6}>
      <HomePageVisitedByType kind="top" />
    </Grid>
  );
};

export const TopEmpty = () => {
  return (
    <Grid item xs={12} md={6}>
      <HomePageVisitedByType kind="top" visits={[]} />
    </Grid>
  );
};

export const TopFewItems = () => {
  return (
    <Grid item xs={12} md={6}>
      <HomePageVisitedByType kind="top" visits={visits.slice(0, 1)} />
    </Grid>
  );
};

export const TopMoreItems = () => {
  return (
    <Grid item xs={12} md={6}>
      <HomePageVisitedByType kind="top" numVisitsOpen={5} numVisitsTotal={6} />
    </Grid>
  );
};

export const TopLoading = () => {
  return (
    <Grid item xs={12} md={6}>
      <HomePageVisitedByType
        kind="top"
        numVisitsOpen={5}
        numVisitsTotal={6}
        loading
      />
    </Grid>
  );
};
