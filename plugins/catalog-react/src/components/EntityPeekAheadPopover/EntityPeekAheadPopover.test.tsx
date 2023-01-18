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

import { screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import React from 'react';
import { EntityPeekAheadPopover } from './EntityPeekAheadPopover';
import { ApiProvider } from '@backstage/core-app-api';
import { TestApiRegistry, renderInTestApp } from '@backstage/test-utils';
import { catalogApiRef } from '../../api';
import { Entity } from '@backstage/catalog-model';
import { CatalogApi } from '@backstage/catalog-client';
import { Button } from '@material-ui/core';
import { entityRouteRef } from '../../routes';

const catalogApi: Partial<CatalogApi> = {
  getEntityByRef: async (entityRef: string): Promise<Entity | undefined> => {
    if (entityRef === 'component:default/service1') {
      return {
        apiVersion: '',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'service1',
        },
        spec: {
          tags: ['java'],
        },
      };
    }
    return undefined;
  },
};

const apis = TestApiRegistry.from([catalogApiRef, catalogApi]);

describe('<EntityPeekAheadPopover/>', () => {
  it('renders all owners', async () => {
    renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityPeekAheadPopover entityRef="component:default/service1">
          <Button data-testid="popover1">s1</Button>
        </EntityPeekAheadPopover>
        <EntityPeekAheadPopover entityRef="component:default/service2">
          <Button data-testid="popover2">s2</Button>
        </EntityPeekAheadPopover>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );
    expect(screen.getByText('s1')).toBeInTheDocument();
    expect(screen.queryByText('service1')).toBeNull();
    user.hover(screen.getByTestId('popover1'));
    expect(await screen.findByText('service1')).toBeInTheDocument();

    expect(screen.getByText('s2')).toBeInTheDocument();
    expect(screen.queryByText('service2')).toBeNull();
    user.hover(screen.getByTestId('popover2'));
    expect(
      await screen.findByText('Error: component:default/service2 not found'),
    ).toBeInTheDocument();
  });
});
