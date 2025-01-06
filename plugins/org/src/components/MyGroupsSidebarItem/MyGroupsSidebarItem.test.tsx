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
import { catalogApiRef, entityRouteRef } from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';

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
                profile: {
                  displayName: 'Team A',
                },
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

  describe('For users that are members of multiple groups', () => {
    it('MyGroupsSidebarItem should display a sub-menu with all their groups, with displaying the title through displayName, and a link to each group', async () => {
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
                profile: {
                  displayName: 'Team A',
                },
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
                profile: {
                  displayName: 'Team B',
                },
              },
            },
            {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Group',
              metadata: {
                name: 'team-c',
                title: 'Team C',
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
      const rendered = await renderInTestApp(
        <TestApiProvider
          apis={[
            [identityApiRef, identityApi],
            [catalogApiRef, catalogApi],
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

      expect(rendered.getByLabelText('My Squads')).toBeInTheDocument();
      expect(rendered.getByLabelText('Team B')).toBeInTheDocument();
      expect(rendered.getByLabelText('Team A')).not.toBeInTheDocument();
      expect(rendered.getByLabelText('Team C')).toHaveAttribute(
        'href',
        '/catalog/default/Group/team-c',
      );
    });

    it('MyGroupsSidebarItem should display the metadata name when the displayName property is not available in the entity', async () => {
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
                title: 'Team C',
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
      expect(rendered.getByLabelText('Team-a')).toBeInTheDocument();
      expect(rendered.getByLabelText('Team-b')).toBeInTheDocument();
      expect(rendered.getByLabelText('Team-c')).toBeInTheDocument();
    });
  });
});

describe('When an additional filter is not provided', () => {
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
