/*
 * Copyright 2022 The Backstage Authors
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

import {
  renderInTestApp,
  TestApiProvider,
  mockApis,
} from '@backstage/test-utils';
import React from 'react';
import { MyGroupsSidebarItem } from './MyGroupsSidebarItem';
import GroupIcon from '@material-ui/icons/People';
import { identityApiRef } from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';
import {
  catalogApiRef,
  entityPresentationApiRef,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { DefaultEntityPresentationApi } from '@backstage/plugin-catalog';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';

describe('MyGroupsSidebarItem Test', () => {
  describe('For guests or users with no groups', () => {
    it('MyGroupsSidebarItem should be empty', async () => {
      const identityApi = mockApis.identity({
        userEntityRef: 'user:default/guest',
        ownershipEntityRefs: ['user:default/guest'],
      });
      const catalogApi = catalogApiMock();
      const rendered = await renderInTestApp(
        <TestApiProvider
          apis={[
            [identityApiRef, identityApi],
            [catalogApiRef, catalogApi],
            [
              entityPresentationApiRef,
              DefaultEntityPresentationApi.create({ catalogApi }),
            ],
          ]}
        >
          <MyGroupsSidebarItem
            singularTitle="My Squad"
            pluralTitle="My Squads"
            icon={GroupIcon}
          />
        </TestApiProvider>,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
          },
        },
      );
      expect(rendered.container).toBeEmptyDOMElement();
    });
  });

  describe('For users that are members of a single group', () => {
    it('MyGroupsSidebarItem should display a single item that links to their group', async () => {
      const identityApi = mockApis.identity({
        userEntityRef: 'user:default/nigel.manning',
        ownershipEntityRefs: ['user:default/nigel.manning'],
      });
      const catalogApi = catalogApiMock.mock({
        getEntities: async () => ({
          items: [
            {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Group',
              metadata: {
                name: 'team-a',
                title: 'Team A',
                namespace: 'default',
              },
              spec: {
                type: 'team',
                children: [],
              },
            },
          ] as Entity[],
        }),
      });
      const rendered = await renderInTestApp(
        <TestApiProvider
          apis={[
            [identityApiRef, identityApi],
            [catalogApiRef, catalogApi],
            [
              entityPresentationApiRef,
              DefaultEntityPresentationApi.create({ catalogApi }),
            ],
          ]}
        >
          <MyGroupsSidebarItem
            singularTitle="My Squad"
            pluralTitle="My Squads"
            icon={GroupIcon}
          />
        </TestApiProvider>,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
          },
        },
      );
      expect(rendered.getByLabelText('My Squad')).toBeInTheDocument();
      expect(rendered.getByLabelText('My Squad')).toHaveAttribute(
        'href',
        '/catalog/default/Group/team-a',
      );
    });
  });

  async function renderSideBarWithUserGroups() {
    const identityApi = mockApis.identity({
      userEntityRef: 'user:default/nigel.manning',
      ownershipEntityRefs: ['user:default/nigel.manning'],
    });
    const catalogApi = catalogApiMock.mock({
      getEntities: async () => ({
        items: [
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Group',
            metadata: {
              name: 'team-a',
              namespace: 'default',
            },
            spec: {
              type: 'team',
              children: [],
            },
          },
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Group',
            metadata: {
              name: 'team-b',
              title: 'Team B',
              namespace: 'default',
            },
            spec: {
              type: 'team',
              children: [],
            },
          },
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Group',
            metadata: {
              name: 'team-c',
              namespace: 'default',
            },
            spec: {
              type: 'team',
              children: [],
              profile: {
                displayName: 'Team C',
              },
            },
          },
        ] as Entity[],
      }),
    });

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [identityApiRef, identityApi],
          [catalogApiRef, catalogApi],
          [
            entityPresentationApiRef,
            DefaultEntityPresentationApi.create({ catalogApi }),
          ],
        ]}
      >
        <MyGroupsSidebarItem
          singularTitle="My Squad"
          pluralTitle="My Squads"
          icon={GroupIcon}
        />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );
  }

  describe('For users that are members of multiple groups', () => {
    beforeEach(async () => {
      await renderSideBarWithUserGroups();
    });

    it('MyGroupsSidebarItem should display a sub-menu with all their groups and a link to each group', async () => {
      expect(screen.getByLabelText('My Squads')).toBeInTheDocument();
    });

    it('MyGroupsSidebarItem should display the displayName for each group in the list instead of the metadata name using the entityPresentationApi', async () => {
      await userEvent.hover(screen.getByLabelText('My Squads'));
      expect(screen.getByText('team-a')).toBeInTheDocument();
      expect(screen.getByText('Team B')).toBeInTheDocument();
      expect(screen.getByText('Team C')).toBeInTheDocument();
    });
  });

  describe('When an additional filter is not provided', () => {
    const entityPresentationApi = {
      forEntity: jest.fn(),
    };
    it('catalogApi.getEntities() should be called with the default filter', async () => {
      const identityApi = mockApis.identity({
        userEntityRef: 'user:default/guest',
        ownershipEntityRefs: ['user:default/guest'],
      });
      const mockCatalogApi = catalogApiMock.mock();
      await renderInTestApp(
        <TestApiProvider
          apis={[
            [identityApiRef, identityApi],
            [catalogApiRef, mockCatalogApi],
            [entityPresentationApiRef, entityPresentationApi],
          ]}
        >
          <MyGroupsSidebarItem
            singularTitle="My Squad"
            pluralTitle="My Squads"
            icon={GroupIcon}
          />
        </TestApiProvider>,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
          },
        },
      );
      expect(mockCatalogApi.getEntities).toHaveBeenCalledWith({
        filter: [
          {
            kind: 'group',
            'relations.hasMember': 'user:default/guest',
          },
        ],
        fields: ['metadata', 'kind'],
      });
    });
  });

  describe('When an additional filter is provided', () => {
    const entityPresentationApi = {
      forEntity: jest.fn(),
    };

    it('catalogApi.getEntities() should be called with an additional filter item', async () => {
      const identityApi = mockApis.identity({
        userEntityRef: 'user:default/guest',
        ownershipEntityRefs: ['user:default/guest'],
      });
      const mockCatalogApi = catalogApiMock.mock();
      await renderInTestApp(
        <TestApiProvider
          apis={[
            [identityApiRef, identityApi],
            [catalogApiRef, mockCatalogApi],
            [entityPresentationApiRef, entityPresentationApi],
          ]}
        >
          <MyGroupsSidebarItem
            singularTitle="My Squad"
            pluralTitle="My Squads"
            icon={GroupIcon}
            filter={{ 'spec.type': 'team' }}
          />
        </TestApiProvider>,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
          },
        },
      );
      expect(mockCatalogApi.getEntities).toHaveBeenCalledWith({
        filter: [
          {
            kind: 'group',
            'relations.hasMember': 'user:default/guest',
            'spec.type': 'team',
          },
        ],
        fields: ['metadata', 'kind'],
      });
    });
  });
});
