/*
 * Copyright 2026 The Backstage Authors
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
  catalogApiRef,
  EntityProvider,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import {
  mockApis,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import { GroupProfileCard } from './GroupProfileCard';

describe('GroupProfileCard', () => {
  const catalogApi = catalogApiMock.mock();
  const permissionApi = mockApis.permission();

  const groupEntity: GroupEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Group',
    metadata: {
      name: 'team-a',
      description: 'The team a description',
      namespace: 'default',
    },
    spec: {
      type: 'team',
      profile: {
        displayName: 'Team A Display Name',
        email: 'team-a@example.com',
        picture: 'https://example.com/team-a.jpg',
      },
      children: [],
    },
  };

  it('renders the card with entity presentation title', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, catalogApi],
          [permissionApiRef, permissionApi],
        ]}
      >
        <EntityProvider entity={groupEntity}>
          <GroupProfileCard />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(screen.getByText('Team A Display Name')).toBeInTheDocument();
    expect(screen.getByText('The team a description')).toBeInTheDocument();
    expect(screen.getByText('team-a@example.com')).toBeInTheDocument();
  });

  it('renders entity name when display name is not provided', async () => {
    const groupWithoutDisplayName: GroupEntity = {
      ...groupEntity,
      spec: {
        ...groupEntity.spec,
        profile: undefined,
      },
    };

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, catalogApi],
          [permissionApiRef, permissionApi],
        ]}
      >
        <EntityProvider entity={groupWithoutDisplayName}>
          <GroupProfileCard />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(screen.getByText('team-a')).toBeInTheDocument();
  });
});
