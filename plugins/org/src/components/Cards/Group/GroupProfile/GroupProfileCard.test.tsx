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

import { alertApiRef } from '@backstage/core-plugin-api';
import { GroupEntity } from '@backstage/catalog-model';
import { translationApiRef } from '@backstage/core-plugin-api/alpha';
import {
  catalogApiRef,
  EntityProvider,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import {
  mockApis,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { screen } from '@testing-library/react';
import { GroupProfileCard } from './GroupProfileCard';

describe('GroupProfileCard', () => {
  const groupEntity: GroupEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Group',
    metadata: { name: 'team-a' },
    spec: { type: 'team', children: [] },
  };

  const render = (translationApi = mockApis.translation()) =>
    renderInTestApp(
      <TestApiProvider
        apis={[
          [translationApiRef, translationApi],
          [catalogApiRef, catalogApiMock()],
          [alertApiRef, { post: jest.fn() }],
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <EntityProvider entity={groupEntity}>
          <GroupProfileCard />
        </EntityProvider>
      </TestApiProvider>,
      { mountedRoutes: { '/catalog/:namespace/:kind/:name': entityRouteRef } },
    );

  it('shows N/A for a group without parent or child groups', async () => {
    await render();

    expect(screen.getAllByText('N/A')).toHaveLength(2);
  });

  it('translates the placeholder shown for missing parent and child groups', async () => {
    const base = mockApis.translation();
    const translationApi: typeof base = {
      translation$: ref => base.translation$(ref),
      getTranslation: ref => {
        const snapshot = base.getTranslation(ref);
        if (!snapshot.ready) {
          return snapshot;
        }
        return {
          ...snapshot,
          t: ((key: string, ...args: unknown[]) =>
            key === 'groupProfileCard.listItemValue.notAvailable'
              ? 'Non disponible'
              : (snapshot.t as Function)(key, ...args)) as typeof snapshot.t,
        };
      },
    };

    await render(translationApi);

    expect(screen.getAllByText('Non disponible')).toHaveLength(2);
    expect(screen.queryByText('N/A')).not.toBeInTheDocument();
  });
});
