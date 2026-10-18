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

import { screen } from '@testing-library/react';
import { Route } from 'react-router-dom';
import { FlatRoutes } from '@backstage/core-app-api';
import { getComponentData } from '@backstage/core-plugin-api';
import {
  convertLegacyPageExtension,
  convertLegacyRouteRef,
} from '@backstage/core-compat-api';
import {
  createFrontendPlugin,
  createRouteRef,
  PageBlueprint,
  useRouteRef,
} from '@backstage/frontend-plugin-api';
import { renderTestApp } from '@backstage/frontend-test-utils';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { RouteResolver as LegacyRouteResolver } from '../../../packages/core-app-api/src/routing/RouteResolver';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { collectLegacyRoutes } from '../../../packages/core-compat-api/src/collectLegacyRoutes';
import { CatalogIndexPage, CatalogEntityPage, catalogPlugin } from './plugin';
import { rootRouteRef } from './legacyRoutes';
import { entityRouteRef } from '@backstage/plugin-catalog-react';

function Probe() {
  const entity = useRouteRef(convertLegacyRouteRef(entityRouteRef));
  const shared = useRouteRef(rootRouteRef);
  const copy = useRouteRef(createRouteRef({ extensionId: 'page:catalog' }));
  return (
    <div>
      <span>
        Shared: {shared?.()} Copy: {copy?.()}
      </span>
      <span>Entity: {entity ? 'mounted' : 'unmounted'}</span>
    </div>
  );
}

const probe = PageBlueprint.make({
  name: 'probe',
  params: { path: '/probe', loader: async () => <Probe /> },
});

it('preserves the legacy Catalog mount and resolves a native replacement without registration', async () => {
  expect(catalogPlugin.routes.catalogIndex).toBe(rootRouteRef);
  expect(getComponentData(<CatalogIndexPage />, 'core.mountPoint')).toBe(
    rootRouteRef,
  );
  const legacy = new LegacyRouteResolver(
    new Map([[rootRouteRef, '/old-catalog']]),
    new Map(),
    [],
    new Map(),
    '',
  );
  expect(legacy.resolve(rootRouteRef, '/')?.()).toBe('/old-catalog');
  renderTestApp({
    initialRouteEntries: ['/probe'],
    extensions: [probe],
    features: [
      createFrontendPlugin({
        pluginId: 'catalog',
        routes: { catalogIndex: rootRouteRef },
        extensions: [
          PageBlueprint.make({
            params: { path: '/custom-catalog', loader: async () => <div /> },
          }),
        ],
      }),
    ],
  });
  expect(
    await screen.findByText('Shared: /custom-catalog Copy: /custom-catalog'),
  ).toBeInTheDocument();
});

it.each(['named wrapper', 'flat routes'])(
  'resolves Catalog through hybrid conversion: %s',
  async mode => {
    const features =
      mode === 'named wrapper'
        ? [
            createFrontendPlugin({
              pluginId: 'catalog',
              routes: { catalogIndex: rootRouteRef },
              extensions: [
                convertLegacyPageExtension(CatalogIndexPage, {
                  name: 'renamed',
                  path: '/converted-catalog',
                }),
              ],
            }),
          ]
        : collectLegacyRoutes(
            <FlatRoutes>
              <Route path="/converted-catalog" element={<CatalogIndexPage />} />
            </FlatRoutes>,
          );
    renderTestApp({
      initialRouteEntries: ['/probe'],
      extensions: [probe],
      features,
    });
    expect(
      await screen.findByText(
        'Shared: /converted-catalog Copy: /converted-catalog',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Entity: unmounted')).toBeInTheDocument();
  },
);

it.each(['native', 'hybrid'])(
  'resolves the entity ref and structural copies in a %s app',
  async mode => {
    const ref = convertLegacyRouteRef(entityRouteRef);
    const params = { namespace: 'default', kind: 'component', name: 'example' };
    const EntityProbe = () => {
      const shared = useRouteRef(ref);
      const copy = useRouteRef(
        createRouteRef({
          extensionId: 'page:catalog/entity',
          params: ['namespace', 'kind', 'name'],
        }),
      );
      return (
        <div>
          Shared: {shared?.(params)} Copy: {copy?.(params)}
        </div>
      );
    };
    const legacy = new LegacyRouteResolver(
      new Map([[entityRouteRef, '/entities/:namespace/:kind/:name']]),
      new Map(),
      [],
      new Map(),
      '',
    );
    expect(legacy.resolve(entityRouteRef, '/')?.(params)).toBe(
      '/entities/default/component/example',
    );
    renderTestApp({
      initialRouteEntries: ['/probe'],
      extensions: [
        PageBlueprint.make({
          name: 'probe',
          params: { path: '/probe', loader: async () => <EntityProbe /> },
        }),
      ],
      features: [
        createFrontendPlugin({
          pluginId: 'catalog',
          routes: { entity: ref },
          extensions: [
            mode === 'native'
              ? PageBlueprint.make({
                  name: 'entity',
                  params: { path: '/entities/:namespace/:kind/:name' },
                })
              : convertLegacyPageExtension(CatalogEntityPage, {
                  name: 'renamed-entity',
                  path: '/entities/:namespace/:kind/:name',
                }),
          ],
        }),
      ],
    });
    expect(
      await screen.findByText(
        'Shared: /entities/default/component/example Copy: /entities/default/component/example',
      ),
    ).toBeInTheDocument();
  },
);
