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

import { UserEntity } from '@backstage/catalog-model';
import {
  EntityProvider,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { wrapInTestApp } from '@backstage/test-utils';
import { Grid } from '@material-ui/core';
import React, { ComponentType } from 'react';
import { UserProfileCard } from './UserProfileCard';

const dummyGroup = {
  type: 'memberOf',
  targetRef: 'group:default/team-a',
  target: {
    namespace: 'default',
    kind: 'group',
    name: 'team-a',
  },
};

const defaultEntity: UserEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'User',
  metadata: {
    name: 'guest',
    description: 'Description for guest',
  },
  spec: {
    profile: {
      displayName: 'Guest User',
      email: 'guest@example.com',
      picture:
        'https://avatars.dicebear.com/api/avataaars/guest@example.com.svg?background=%23fff',
    },
    memberOf: ['team-a'],
  },
  relations: [dummyGroup],
};

export const Default = () => (
  <EntityProvider entity={defaultEntity}>
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <UserProfileCard variant="gridItem" />
      </Grid>
    </Grid>
  </EntityProvider>
);

const noImageEntity: UserEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'User',
  metadata: {
    name: 'guest',
    description: 'Description for guest',
  },
  spec: {
    profile: {
      displayName: 'Guest User',
      email: 'guest@example.com',
    },
    memberOf: ['team-a'],
  },
  relations: [dummyGroup],
};

export const NoImage = () => (
  <EntityProvider entity={noImageEntity}>
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <UserProfileCard variant="gridItem" />
      </Grid>
    </Grid>
  </EntityProvider>
);

export default {
  title: 'Plugins/Org/User Profile Card',
  component: UserProfileCard,
  decorators: [
    (Story: ComponentType<{}>) =>
      wrapInTestApp(<Story />, {
        mountedRoutes: {
          '/a': entityRouteRef,
        },
      }),
  ],
};
