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

import { GroupEntity } from '@backstage/catalog-model';
import {
  CatalogApi,
  catalogApiRef,
  EntityProvider,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { TestApiProvider, wrapInTestApp } from '@backstage/test-utils';
import { Grid } from '@material-ui/core';
import React, { ComponentType } from 'react';
import { GroupProfileCard } from './GroupProfileCard';

const dummyDepartment = {
  type: 'childOf',
  targetRef: 'group:default/department-a',
  target: {
    namespace: 'default',
    kind: 'group',
    name: 'department-a',
  },
};

const defaultEntity: GroupEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Group',
  metadata: {
    name: 'team-a',
    description: 'Team A',
  },
  spec: {
    profile: {
      displayName: 'Team A',
      email: 'team-a@example.com',
      picture:
        'https://avatars.dicebear.com/api/identicon/team-a@example.com.svg?background=%23fff&margin=25',
    },
    type: 'group',
    children: [],
  },
  relations: [dummyDepartment],
};

const catalogApi: Partial<CatalogApi> = {
  async refreshEntity() {},
};

export const Default = () => (
  <EntityProvider entity={defaultEntity}>
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <GroupProfileCard variant="gridItem" />
      </Grid>
    </Grid>
  </EntityProvider>
);

export default {
  title: 'Plugins/Org/Group Profile Card',
  component: GroupProfileCard,
  decorators: [
    (Story: ComponentType<{}>) =>
      wrapInTestApp(
        <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
          <Story />
        </TestApiProvider>,
        {
          mountedRoutes: {
            '/a': entityRouteRef,
          },
        },
      ),
  ],
};

const extraDetailsEntity: GroupEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Group',
  metadata: {
    name: 'team-a',
    description: 'Team A',
    links: [
      {
        url: 'slack://user?team=T00000000&id=U00000000',
        title: 'Slack',
        icon: 'chat',
      },
      {
        url: 'https://www.google.com',
        title: 'Google',
      },
    ],
  },
  spec: {
    profile: {
      displayName: 'Team A',
      email: 'team-a@example.com',
      picture:
        'https://avatars.dicebear.com/api/identicon/team-a@example.com.svg?background=%23fff&margin=25',
    },
    type: 'group',
    children: [],
  },
  relations: [dummyDepartment],
};

export const ExtraDetails = () => (
  <EntityProvider entity={extraDetailsEntity}>
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <GroupProfileCard variant="gridItem" />
      </Grid>
    </Grid>
  </EntityProvider>
);
