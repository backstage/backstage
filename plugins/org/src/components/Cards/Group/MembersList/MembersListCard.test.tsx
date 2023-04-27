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

import { Entity, GroupEntity } from '@backstage/catalog-model';
import {
  CatalogApi,
  catalogApiRef,
  EntityProvider,
  StarredEntitiesApi,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import {
  renderInTestApp,
  renderWithEffects,
  TestApiProvider,
  wrapInTestApp,
} from '@backstage/test-utils';
import React from 'react';
import { MembersListCard } from './MembersListCard';
import {
  groupA,
  mockedCatalogApiSupportingGroups,
} from '../../../../test-helpers/catalogMocks';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import { EntityLayout } from '@backstage/plugin-catalog';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Observable } from '@backstage/types';

// Mock needed because jsdom doesn't correctly implement box-sizing
// https://github.com/ShinyChang/React-Text-Truncate/issues/70
// https://stackoverflow.com/questions/71916701/how-to-mock-a-react-function-component-that-takes-a-ref-prop
jest.mock('react-text-truncate', () => {
  const { forwardRef } = jest.requireActual('react');
  return {
    __esModule: true,
    default: forwardRef((props: any, ref: any) => (
      <div ref={ref}>{props.text}</div>
    )),
  };
});

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

  const catalogApi: Partial<CatalogApi> = {
    getEntities: () =>
      Promise.resolve({
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
        ] as Entity[],
      }),
  };

  it('Display Profile Card', async () => {
    const rendered = await renderWithEffects(
      wrapInTestApp(
        <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
          <EntityProvider entity={groupEntity}>
            <MembersListCard />
          </EntityProvider>
          ,
        </TestApiProvider>,
      ),
    );

    expect(rendered.getByAltText('Tara MacGovern')).toHaveAttribute(
      'src',
      'https://example.com/staff/tara.jpeg',
    );
    expect(
      rendered.getByText('tara-macgovern@example.com'),
    ).toBeInTheDocument();
    expect(rendered.getByText('Tara MacGovern').closest('a')).toHaveAttribute(
      'href',
      '/catalog/foo-bar/user/tara.macgovern',
    );

    expect(rendered.getByText('Super Awesome Developer')).toBeInTheDocument();

    expect(rendered.getByText('Members (1)')).toBeInTheDocument();
  });

  it('Can render different member display title', async () => {
    const rendered = await renderWithEffects(
      wrapInTestApp(
        <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
          <EntityProvider entity={groupEntity}>
            <MembersListCard memberDisplayTitle="Testers" />
          </EntityProvider>
        </TestApiProvider>,
      ),
    );

    expect(rendered.getByText('Testers (1)')).toBeInTheDocument();
  });

  describe('Aggregate members toggle', () => {
    it('Does not show the aggregate members toggle if the showAggregateMembersToggle prop is undefined', async () => {
      await renderInTestApp(
        <TestApiProvider
          apis={[
            [catalogApiRef, mockedCatalogApiSupportingGroups],
            [starredEntitiesApiRef, mockedStarredEntitiesApi],
            [permissionApiRef, {}],
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
            [permissionApiRef, {}],
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
      );

      expect(screen.queryByRole('checkbox')).toBeInTheDocument();
    });

    it('Shows only direct members if the showAggregateMembersToggle prop is undefined', async () => {
      await renderInTestApp(
        <TestApiProvider
          apis={[
            [catalogApiRef, mockedCatalogApiSupportingGroups],
            [starredEntitiesApiRef, mockedStarredEntitiesApi],
            [permissionApiRef, {}],
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
            [permissionApiRef, {}],
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
            [permissionApiRef, {}],
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
      );

      // Click the toggle switch
      await userEvent.click(screen.getByRole('checkbox'));

      const displayedMemberNames = screen.queryAllByTestId('user-link');
      const duplicatedUserText = screen.getByText('Duplicated User');
      const groupAUserOneText = screen.getByText('Group A User One');
      const groupBUserOneText = screen.getByText('Group B User One');
      const groupDUserOneText = screen.getByText('Group D User One');
      const groupEUserOneText = screen.getByText('Group E User One');

      expect(displayedMemberNames).toHaveLength(5);

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
});
