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

import { Entity, GroupEntity } from '@backstage/catalog-model';
import {
  catalogApiRef,
  EntityProvider,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { TestApiProvider, wrapInTestApp } from '@backstage/test-utils';
import Grid from '@material-ui/core/Grid';
import React, { ComponentType, PropsWithChildren } from 'react';
import {
  groupA,
  mockedCatalogApiSupportingGroups,
} from '../../../../__testUtils__/catalogMocks';
import { MembersListCard } from './MembersListCard';

export default {
  title: 'Plugins/Org/Group Members List Card',
  component: MembersListCard,
  decorators: [
    (Story: ComponentType<PropsWithChildren<{}>>) =>
      wrapInTestApp(
        <div>
          <Story />
        </div>,
        { mountedRoutes: { '/': entityRouteRef } },
      ),
  ],
};

const makeUser = ({
  name,
  uid,
  displayName,
  description,
  email,
}: {
  name: string;
  uid: string;
  displayName: string;
  description: string;
  email: string;
}) => ({
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'User',
  metadata: {
    name,
    uid,
    description,
  },
  spec: {
    profile: {
      displayName,
      email,
      picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=bob${name}`,
    },
  },
  relations: [
    {
      type: 'memberOf',
      targetRef: 'group:default/team-a',
      target: {
        namespace: 'default',
        kind: 'group',
        name: 'team-a',
      },
    },
  ],
});

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
        'https://api.dicebear.com/7.x/identicon/svg?seed=Fluffy&backgroundType=solid,gradientLinear&backgroundColor=ffd5dc,b6e3f4',
    },
    type: 'group',
    children: [],
  },
};

const alice = makeUser({
  name: 'alice',
  uid: '123',
  displayName: 'Alice Doe',
  description: 'Developer',
  email: 'alice@example.com',
});
const bob = makeUser({
  name: 'bob',
  uid: '456',
  displayName: 'Bob Jones',
  description: 'Developer',
  email: 'bob@example.com',
});

const catalogApi = (items: Entity[]) => ({
  getEntities: () => Promise.resolve({ items }),
});
export const Default = () => (
  <TestApiProvider apis={[[catalogApiRef, catalogApi([alice, bob])]]}>
    <EntityProvider entity={defaultEntity}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <MembersListCard />
        </Grid>
      </Grid>
    </EntityProvider>
  </TestApiProvider>
);

export const Empty = () => (
  <TestApiProvider apis={[[catalogApiRef, catalogApi([])]]}>
    <EntityProvider entity={defaultEntity}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <MembersListCard />
        </Grid>
      </Grid>
    </EntityProvider>
  </TestApiProvider>
);

export const AggregateMembersToggle = () => (
  <TestApiProvider apis={[[catalogApiRef, mockedCatalogApiSupportingGroups]]}>
    <EntityProvider entity={groupA}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <MembersListCard showAggregateMembersToggle />
        </Grid>
      </Grid>
    </EntityProvider>
  </TestApiProvider>
);
