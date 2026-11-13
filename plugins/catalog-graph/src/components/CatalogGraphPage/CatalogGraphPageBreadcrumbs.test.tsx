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

import { renderTestApp } from '@backstage/frontend-test-utils';
import {
  entityPresentationApiRef,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import catalogGraphPlugin from '../../alpha';
import { catalogGraphApiRef, DefaultCatalogGraphApi } from '../../api';

jest.setTimeout(30_000);

jest.mock('../EntityRelationsGraph', () => ({
  EntityRelationsGraph: (props: {
    onNodeClick?: (node: any, event: any) => void;
  }) => (
    <button
      type="button"
      onClick={event =>
        props.onNodeClick?.(
          {
            id: 'component:default/other',
            entity: {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Component',
              metadata: { name: 'other', namespace: 'default' },
            },
          },
          event,
        )
      }
    >
      select other
    </button>
  ),
}));

const entities = ['my-service', 'other', 'third'].map(name => ({
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: { name, namespace: 'default' },
}));

const forEntity = (entityRef: string) => {
  const snapshot = {
    entityRef,
    primaryTitle: `Title of ${entityRef.split('/')[1]}`,
  };
  return { snapshot, promise: Promise.resolve(snapshot) };
};

describe('catalog graph page breadcrumbs', () => {
  it('shows the root entity as a breadcrumb and follows the root', async () => {
    const catalog = catalogApiMock({ entities });
    const getEntitiesByRefs = jest.spyOn(catalog, 'getEntitiesByRefs');

    renderTestApp({
      features: [catalogGraphPlugin],
      initialRouteEntries: ['/catalog-graph'],
      mountedRoutes: {
        '/catalog/:namespace/:kind/:name': entityRouteRef,
      },
      apis: [
        catalog,
        [catalogGraphApiRef, new DefaultCatalogGraphApi()],
        [entityPresentationApiRef, { forEntity }],
      ],
      config: {
        app: {
          baseUrl: 'http://localhost:3000',
          extensions: [
            {
              'page:catalog-graph': {
                config: {
                  showFilters: false,
                  rootEntityRefs: [
                    'component:default/my-service',
                    'component:default/third',
                  ],
                },
              },
            },
          ],
        },
        backend: { baseUrl: 'http://localhost:7007' },
      },
    });

    const entityCrumb = await screen.findByRole('link', {
      name: 'Title of my-service (+1)',
    });
    expect(entityCrumb).toHaveAttribute(
      'href',
      '/catalog/default/component/my-service',
    );

    const trail = entityCrumb.closest('ol')!;
    const crumbs = within(trail).getAllByRole('listitem');
    expect(crumbs.map(c => c.textContent)).toEqual([
      'Catalog Graph',
      'Title of my-service (+1)',
      'Relations',
    ]);

    // Toggling filters changes the URL but not the roots
    const callsBefore = getEntitiesByRefs.mock.calls.length;
    await userEvent.click(screen.getByRole('button', { name: 'Filters' }));
    expect(await screen.findByText('Max depth')).toBeInTheDocument();
    expect(getEntitiesByRefs).toHaveBeenCalledTimes(callsBefore);

    await userEvent.click(screen.getByRole('button', { name: 'select other' }));

    const updated = await screen.findByRole('link', {
      name: 'Title of other',
    });
    expect(updated).toHaveAttribute('href', '/catalog/default/component/other');
    expect(
      screen.queryByRole('link', { name: 'Title of my-service (+1)' }),
    ).not.toBeInTheDocument();
    expect(
      within(updated.closest('ol')!)
        .getAllByRole('listitem')
        .map(c => c.textContent),
    ).toEqual(['Catalog Graph', 'Title of other', 'Relations']);
  });
});
