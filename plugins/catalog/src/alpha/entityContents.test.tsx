/*
 * Copyright 2025 The Backstage Authors
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

import React, { Fragment } from 'react';
import { screen, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import {
  createExtensionTester,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/frontend-test-utils';
import { catalogOverviewEntityContent } from './entityContents';
import {
  EntityCardBlueprint,
  EntityContentLayoutBlueprint,
} from '@backstage/plugin-catalog-react/alpha';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import {
  catalogApiRef,
  EntityProvider,
  MockStarredEntitiesApi,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';

describe('Overview content', () => {
  const entityMock = {
    metadata: {
      namespace: 'default',
      annotations: {
        'backstage.io/managed-by-location':
          'file:/Users/camilal/Workspace/backstage/packages/catalog-model/examples/components/artist-lookup-component.yaml',
        'backstage.io/managed-by-origin-location':
          'file:/Users/camilal/Workspace/backstage/packages/catalog-model/examples/all.yaml',
        'backstage.io/source-template': 'template:default/springboot-template',
        'backstage.io/linguist':
          'https://github.com/backstage/backstage/tree/master/plugins/playlist',
      },
      name: 'artist-lookup',
      description: 'Artist Lookup',
      tags: ['java', 'data'],
      links: [
        {
          url: 'https://example.com/user',
          title: 'Examples Users',
          icon: 'user',
        },
        {
          url: 'https://example.com/group',
          title: 'Example Group',
          icon: 'group',
        },
        {
          url: 'https://example.com/cloud',
          title: 'Link with Cloud Icon',
          icon: 'cloud',
        },
        {
          url: 'https://example.com/dashboard',
          title: 'Dashboard',
          icon: 'dashboard',
        },
        { url: 'https://example.com/help', title: 'Support', icon: 'help' },
        { url: 'https://example.com/web', title: 'Website', icon: 'web' },
        {
          url: 'https://example.com/alert',
          title: 'Alerts',
          icon: 'alert',
        },
      ],
      uid: '0dc69d61-4715-4912-bd7d-a0d44b421db0',
      etag: 'dcebc518ac79e77356cb34df119a523de51cd522',
    },
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    spec: {
      type: 'service',
      lifecycle: 'experimental',
      owner: 'team-a',
      system: 'artist-engagement-portal',
      dependsOn: ['resource:artists-db'],
      apiConsumedBy: ['component:www-artist'],
    },
    relations: [
      { type: 'apiConsumedBy', targetRef: 'component:default/www-artist' },
      { type: 'dependsOn', targetRef: 'resource:default/artists-db' },
      { type: 'ownedBy', targetRef: 'group:default/team-a' },
      {
        type: 'partOf',
        targetRef: 'system:default/artist-engagement-portal',
      },
    ],
  };

  const mockCatalogApi = catalogApiMock.mock({
    getEntityByRef: async () => entityMock,
  });

  const mockStarredEntitiesApi = new MockStarredEntitiesApi();

  const infoCard = EntityCardBlueprint.make({
    name: 'info-card',
    params: {
      type: 'info',
      loader: async () => <div>Info card</div>,
    },
  });

  const otherCard = EntityCardBlueprint.make({
    name: 'info',
    params: {
      loader: async () => <div>Other card</div>,
    },
  });

  const customLayout = EntityContentLayoutBlueprint.make({
    name: 'custom-layout',
    params: {
      loader:
        async () =>
        ({ cards }) =>
          (
            <div>
              <h3>Custom layout</h3>
              <div id="info">
                {cards
                  .filter(card => card.type === 'info')
                  .map((card, index) => (
                    <Fragment key={index}>{card.element}</Fragment>
                  ))}
              </div>
              <div id="other">
                {cards
                  .filter(card => card.type !== 'info')
                  .map((card, index) => (
                    <Fragment key={index}>{card.element}</Fragment>
                  ))}
              </div>
            </div>
          ),
    },
  });

  it('Should use the default layout', async () => {
    const tester = createExtensionTester(
      Object.assign({ namespace: 'catalog' }, catalogOverviewEntityContent),
    );

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [starredEntitiesApiRef, mockStarredEntitiesApi],
        ]}
      >
        <EntityProvider entity={entityMock}>
          {tester.reactElement()}
        </EntityProvider>
      </TestApiProvider>,
      {
        config: {
          app: {
            title: 'Custom app',
          },
          backend: { baseUrl: 'http://localhost:7000' },
        },
      },
    );

    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: /Custom layout/ }),
      ).not.toBeInTheDocument(),
    );
  });

  it('Should render a custom layout', async () => {
    const tester = createExtensionTester(
      Object.assign({ namespace: 'catalog' }, catalogOverviewEntityContent),
    )
      .add(customLayout)
      .add(infoCard)
      .add(otherCard);

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [starredEntitiesApiRef, mockStarredEntitiesApi],
        ]}
      >
        <EntityProvider entity={entityMock}>
          {tester.reactElement()}
        </EntityProvider>
      </TestApiProvider>,
      {
        config: {
          app: {
            title: 'Custom app',
          },
          backend: { baseUrl: 'http://localhost:7000' },
        },
      },
    );

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /Custom layout/ }),
      ).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(screen.getByText('Info card').parentNode).toHaveAttribute(
        'id',
        'info',
      ),
    );
    await waitFor(() =>
      expect(screen.getByText('Other card').parentNode).toHaveAttribute(
        'id',
        'other',
      ),
    );
  });
});
