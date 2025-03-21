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
import { ApiProvider } from '@backstage/core-app-api';
import {
  CatalogApi,
  catalogApiRef,
  EntityProvider,
} from '@backstage/plugin-catalog-react';
import { TestApiRegistry, wrapInTestApp } from '@backstage/test-utils';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import { catalogIndexRouteRef } from '../../../routes';
import { OwnershipCard } from './OwnershipCard';

export default {
  title: 'Plugins/Org/Ownership Card',
  component: OwnershipCard,
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
        'https://api.dicebear.com/7.x/identicon/svg?seed=Fluffy&backgroundType=solid,gradientLinear&backgroundColor=ffd5dc,b6e3f4',
    },
    type: 'group',
    children: [],
  },
};

const makeComponent = ({ type, name }: { type: string; name: string }) => ({
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name,
  },
  spec: {
    type,
  },
  relations: [
    {
      type: 'ownedBy',
      targetRef: 'group:default/team-a',
      target: {
        namespace: 'default',
        kind: 'group',
        name: 'team-a',
      },
    },
  ],
});

const types = [
  'service',
  'website',
  'api',
  'playlist',
  'grpc',
  'trpc',
  'library',
];

const components = types.map((type, index) =>
  makeComponent({ type, name: `${type}-${index}` }),
);

const catalogApi: Partial<CatalogApi> = {
  getEntities: () => Promise.resolve({ items: components }),
};

const apis = TestApiRegistry.from([catalogApiRef, catalogApi]);

export const Default = () =>
  wrapInTestApp(
    <ApiProvider apis={apis}>
      <EntityProvider entity={defaultEntity}>
        <Grid container spacing={4}>
          <Grid
            item
            xs={12}
            md={6}
            style={{ maxHeight: 320, overflow: 'hidden' }}
          >
            <OwnershipCard />
          </Grid>
        </Grid>
      </EntityProvider>
    </ApiProvider>,
    {
      mountedRoutes: { '/catalog': catalogIndexRouteRef },
    },
  );

export const WithVariableEntityList = {
  argTypes: {
    entityLimit: {
      control: { type: 'number' },
    },
  },
  render: ({ entityLimit }: { entityLimit: number }) =>
    wrapInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={defaultEntity}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <OwnershipCard entityLimit={entityLimit} />
            </Grid>
          </Grid>
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: { '/catalog': catalogIndexRouteRef },
      },
    ),
};
