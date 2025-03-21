/*
 * Copyright 2020 The Backstage Authors
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
  StarredEntitiesApi,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import {
  mockApis,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import React from 'react';
import { MembersListCard } from './MembersListCard';
import {
  groupA,
  mockedCatalogApiSupportingGroups,
} from '../../../../__testUtils__/catalogMocks';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import { EntityLayout, catalogPlugin } from '@backstage/plugin-catalog';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Observable } from '@backstage/types';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';

const mockedStarredEntitiesApi: Partial<StarredEntitiesApi> = {
  starredEntitie$: () => {
    return {
      subscribe: () => {
        return {
          unsubscribe() {
            // This is intentional
          },
        };
      },
    } as Observable<Set<string>>;
  },
};

const rootRouteRef = catalogPlugin.routes.catalogIndex;

describe('MemberTab Test', () => {
  const groupEntity: GroupEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Group',
    metadata: {
      name: 'team-d',
      description: 'The evil-corp organization',
      namespace: 'default',
    },
    spec: {
      type: 'team',
      parent: 'boxoffice',
      children: [],
    },
  };

  const catalogApi = catalogApiMock.mock({
    getEntities: async () => ({
      items: [
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'User',
          metadata: {
            name: 'tara.macgovern',
            namespace: 'foo-bar',
            uid: 'a5gerth56',
            description: 'Super Awesome Developer',
          },
          relations: [
            {
              type: 'memberOf',
              targetRef: 'group:default/team-d',
            },
          ],
          spec: {
            profile: {
              displayName: 'Tara MacGovern',
              email: 'tara-macgovern@example.com',
              picture: 'https://example.com/staff/tara.jpeg',
            },
            memberOf: ['team-d'],
          },
        },
      ],
    }),
  });

  it('Display Profile Card', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <EntityProvider entity={groupEntity}>
          <MembersListCard />
        </EntityProvider>
        ,
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
          '/catalog': rootRouteRef,
        },
      },
    );
    expect(catalogApi.getEntities).toHaveBeenCalledWith({
      filter: {
        kind: 'User',
        'relations.memberof': ['group:default/team-d'],
      },
    });

    expect(screen.getByAltText('Tara MacGovern')).toHaveAttribute(
      'src',
      'https://example.com/staff/tara.jpeg',
    );
    expect(screen.getByText('tara-macgovern@example.com')).toBeInTheDocument();
    expect(screen.getByText('Tara MacGovern').closest('a')).toHaveAttribute(
      'href',
      '/catalog/foo-bar/user/tara.macgovern',
    );

    expect(screen.getByText('Super Awesome Developer')).toBeInTheDocument();

    expect(screen.getByText('Members (1)')).toBeInTheDocument();
  });

  it('Can render different member display title', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <EntityProvider entity={groupEntity}>
          <MembersListCard memberDisplayTitle="Testers" />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
          '/catalog': rootRouteRef,
        },
      },
    );

    expect(screen.getByText('Testers (1)')).toBeInTheDocument();
  });

  it('Can query a different relationship', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <EntityProvider entity={groupEntity}>
          <MembersListCard relationType="leaderOf" />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
          '/catalog': rootRouteRef,
        },
      },
    );

    expect(catalogApi.getEntities).toHaveBeenCalledWith({
      filter: {
        kind: 'User',
        'relations.leaderof': ['group:default/team-d'],
      },
    });
  });

  describe('Aggregate members toggle', () => {
    it('Does not show the aggregate members toggle if the showAggregateMembersToggle prop is undefined', async () => {
      await renderInTestApp(
        <TestApiProvider
          apis={[
            [catalogApiRef, mockedCatalogApiSupportingGroups],
            [starredEntitiesApiRef, mockedStarredEntitiesApi],
            [permissionApiRef, mockApis.permission()],
          ]}
        >
          <EntityProvider entity={groupA}>
            <EntityLayout>
              <EntityLayout.Route path="/" title="Title">
                <MembersListCard />
              </EntityLayout.Route>
            </EntityLayout>
          </EntityProvider>
        </TestApiProvider>,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
            '/catalog': rootRouteRef,
          },
        },
      );
      const toggleSwitch = screen.queryByRole('checkbox');
      expect(toggleSwitch).toBeNull();
    });

    it('Shows the aggregate members toggle if the showAggregateMembersToggle prop is true', async () => {
      await renderInTestApp(
        <TestApiProvider
          apis={[
            [catalogApiRef, mockedCatalogApiSupportingGroups],
            [starredEntitiesApiRef, mockedStarredEntitiesApi],
            [permissionApiRef, mockApis.permission()],
          ]}
        >
          <EntityProvider entity={groupA}>
            <EntityLayout>
              <EntityLayout.Route path="/" title="Title">
                <MembersListCard showAggregateMembersToggle />
              </EntityLayout.Route>
            </EntityLayout>
          </EntityProvider>
        </TestApiProvider>,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
            '/catalog': rootRouteRef,
          },
        },
      );
      expect(screen.queryByRole('checkbox')).toBeInTheDocument();
    });
    it('Shows only direct members if the showAggregateMembersToggle prop is undefined', async () => {
      await renderInTestApp(
        <TestApiProvider
          apis={[
            [catalogApiRef, mockedCatalogApiSupportingGroups],
            [starredEntitiesApiRef, mockedStarredEntitiesApi],
            [permissionApiRef, mockApis.permission()],
          ]}
        >
          <EntityProvider entity={groupA}>
            <EntityLayout>
              <EntityLayout.Route path="/" title="Title">
                <MembersListCard />
              </EntityLayout.Route>
            </EntityLayout>
          </EntityProvider>
        </TestApiProvider>,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
            '/catalog': rootRouteRef,
          },
        },
      );
      const displayedMemberNames = screen.queryAllByTestId('user-link');
      const duplicatedUserText = screen.getByText('Duplicated User');
      const groupAUserOneText = screen.getByText('Group A User One');
      expect(displayedMemberNames).toHaveLength(2);
      expect(duplicatedUserText).toBeInTheDocument();
      expect(groupAUserOneText).toBeInTheDocument();
      expect(
        duplicatedUserText.compareDocumentPosition(groupAUserOneText),
      ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });

    it('Shows only direct members if the aggregate members switch is turned off', async () => {
      await renderInTestApp(
        <TestApiProvider
          apis={[
            [catalogApiRef, mockedCatalogApiSupportingGroups],
            [starredEntitiesApiRef, mockedStarredEntitiesApi],
            [permissionApiRef, mockApis.permission()],
          ]}
        >
          <EntityProvider entity={groupA}>
            <EntityLayout>
              <EntityLayout.Route path="/" title="Title">
                <MembersListCard showAggregateMembersToggle />
              </EntityLayout.Route>
            </EntityLayout>
          </EntityProvider>
        </TestApiProvider>,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
            '/catalog': rootRouteRef,
          },
        },
      );
      const displayedMemberNames = screen.queryAllByTestId('user-link');
      const duplicatedUserText = screen.getByText('Duplicated User');
      const groupAUserOneText = screen.getByText('Group A User One');
      expect(displayedMemberNames).toHaveLength(2);
      expect(duplicatedUserText).toBeInTheDocument();
      expect(groupAUserOneText).toBeInTheDocument();
      expect(
        duplicatedUserText.compareDocumentPosition(groupAUserOneText),
      ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });

    it('Shows all descendant members of the group when the aggregate users switch is turned on, showing duplicated members only once', async () => {
      await renderInTestApp(
        <TestApiProvider
          apis={[
            [catalogApiRef, mockedCatalogApiSupportingGroups],
            [starredEntitiesApiRef, mockedStarredEntitiesApi],
            [permissionApiRef, mockApis.permission()],
          ]}
        >
          <EntityProvider entity={groupA}>
            <EntityLayout>
              <EntityLayout.Route path="/" title="Title">
                <MembersListCard showAggregateMembersToggle />
              </EntityLayout.Route>
            </EntityLayout>
          </EntityProvider>
        </TestApiProvider>,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
            '/catalog': rootRouteRef,
          },
        },
      );

      // Should show only direct users on initial load
      const displayedMemberNamesBefore = screen.queryAllByTestId('user-link');
      expect(displayedMemberNamesBefore).toHaveLength(2);

      // Click the toggle switch
      await userEvent.click(screen.getByRole('checkbox'));
      const displayedMemberNamesAfter = screen.queryAllByTestId('user-link');
      const duplicatedUserText = screen.getByText('Duplicated User');
      const groupAUserOneText = screen.getByText('Group A User One');
      const groupBUserOneText = screen.getByText('Group B User One');
      const groupDUserOneText = screen.getByText('Group D User One');
      const groupEUserOneText = screen.getByText('Group E User One');
      expect(displayedMemberNamesAfter).toHaveLength(5);
      expect(duplicatedUserText).toBeInTheDocument();
      expect(groupAUserOneText).toBeInTheDocument();
      expect(groupBUserOneText).toBeInTheDocument();
      expect(groupDUserOneText).toBeInTheDocument();
      expect(groupEUserOneText).toBeInTheDocument();
      expect(
        duplicatedUserText.compareDocumentPosition(groupAUserOneText),
      ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
      expect(groupAUserOneText.compareDocumentPosition(groupBUserOneText)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
      expect(groupBUserOneText.compareDocumentPosition(groupDUserOneText)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
      expect(groupDUserOneText.compareDocumentPosition(groupEUserOneText)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });
  });

  it('Can default to show aggregated members with the aggregate members toggle', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockedCatalogApiSupportingGroups],
          [starredEntitiesApiRef, mockedStarredEntitiesApi],
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <EntityProvider entity={groupA}>
          <EntityLayout>
            <EntityLayout.Route path="/" title="Title">
              <MembersListCard
                showAggregateMembersToggle
                relationAggregation="aggregated"
              />
            </EntityLayout.Route>
          </EntityLayout>
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
          '/catalog': rootRouteRef,
        },
      },
    );

    // Should show aggregated users on initial load
    const displayedMemberNamesBefore = screen.queryAllByTestId('user-link');
    expect(displayedMemberNamesBefore).toHaveLength(5);

    // Click the toggle switch
    await userEvent.click(screen.getByRole('checkbox'));

    // Should now show only direct users
    const displayedMemberNamesAfter = screen.queryAllByTestId('user-link');
    expect(displayedMemberNamesAfter).toHaveLength(2);
  });

  it('Can show aggregated members without the aggregate members toggle', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockedCatalogApiSupportingGroups],
          [starredEntitiesApiRef, mockedStarredEntitiesApi],
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <EntityProvider entity={groupA}>
          <EntityLayout>
            <EntityLayout.Route path="/" title="Title">
              <MembersListCard relationAggregation="aggregated" />
            </EntityLayout.Route>
          </EntityLayout>
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
          '/catalog': rootRouteRef,
        },
      },
    );

    // aggregated relations checkbox should not be rendered
    expect(screen.queryByRole('checkbox')).toBeNull();

    // Should show all descendant users on load
    const displayedMemberNames = screen.queryAllByTestId('user-link');
    expect(displayedMemberNames).toHaveLength(5);
  });
});
