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

import { FlatRoutes } from '@backstage/core-app-api';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  EntityAboutCard,
  EntityLayout,
  EntitySwitch,
  isKind,
} from '@backstage/plugin-catalog';
import { PuppetDbPage } from '@backstage/plugin-puppetdb';
import { StackstormPage } from '@backstage/plugin-stackstorm';
import { ScoreBoardPage } from '@oriflame/backstage-plugin-score-card';
import React, { Fragment } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { collectLegacyRoutes } from './collectLegacyRoutes';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { toInternalBackstagePlugin } from '../../frontend-plugin-api/src/wiring/createPlugin';
import {
  createPlugin,
  createRoutableExtension,
  createRouteRef,
  useApp,
} from '@backstage/core-plugin-api';
import { createSpecializedApp } from '@backstage/frontend-app-api';
import { render, screen } from '@testing-library/react';

describe('collectLegacyRoutes', () => {
  it('should collect legacy routes', () => {
    const collected = collectLegacyRoutes(
      <FlatRoutes>
        <Route path="/score-board" element={<ScoreBoardPage />} />
        <Route path="/stackstorm" element={<StackstormPage />} />
        <Route path="/puppetdb" element={<PuppetDbPage />} />
        <Route path="/puppetdb" element={<PuppetDbPage />} />
      </FlatRoutes>,
    );

    expect(
      collected.map(p => ({
        id: p.id,
        extensions: toInternalBackstagePlugin(p).extensions.map(e => ({
          id: e.id,
          attachTo: e.attachTo,
          disabled: e.disabled,
          defaultConfig: e.configSchema?.parse({}),
        })),
      })),
    ).toEqual([
      {
        id: 'score-card',
        extensions: [
          {
            id: 'page:score-card',
            attachTo: { id: 'app/routes', input: 'routes' },
            disabled: false,
            defaultConfig: { path: 'score-board' },
          },
          {
            id: 'api:plugin.scoringdata.service',
            attachTo: { id: 'app', input: 'apis' },
            disabled: false,
          },
        ],
      },
      {
        id: 'stackstorm',
        extensions: [
          {
            id: 'page:stackstorm',
            attachTo: { id: 'app/routes', input: 'routes' },
            disabled: false,
            defaultConfig: { path: 'stackstorm' },
          },
          {
            id: 'api:plugin.stackstorm.service',
            attachTo: { id: 'app', input: 'apis' },
            disabled: false,
          },
        ],
      },
      {
        id: 'puppetDb',
        extensions: [
          {
            id: 'page:puppetDb',
            attachTo: { id: 'app/routes', input: 'routes' },
            disabled: false,
            defaultConfig: { path: 'puppetdb' },
          },
          {
            id: 'page:puppetDb/1',
            attachTo: { id: 'app/routes', input: 'routes' },
            disabled: false,
            defaultConfig: { path: 'puppetdb' },
          },
          {
            id: 'api:plugin.puppetdb.service',
            attachTo: { id: 'app', input: 'apis' },
            disabled: false,
          },
        ],
      },
    ]);
  });

  it('supports recursion into children, including passing through fragments', () => {
    const collected = collectLegacyRoutes(
      <FlatRoutes>
        <Route path="/catalog" element={<CatalogIndexPage />} />
        <Route
          path="/catalog/:namespace/:kind/:name"
          element={<CatalogEntityPage />}
        >
          <EntitySwitch>
            <EntitySwitch.Case
              if={isKind('component')}
              children={
                <EntityLayout>
                  <EntityAboutCard variant="gridItem" />
                </EntityLayout>
              }
            />
            <EntitySwitch.Case>
              <EntityLayout>
                <EntityLayout.Route path="/" title="Overview">
                  <Fragment>
                    <Routes>
                      <Route path="/subthing">
                        <ScoreBoardPage />
                      </Route>
                    </Routes>
                  </Fragment>
                </EntityLayout.Route>
              </EntityLayout>
            </EntitySwitch.Case>
          </EntitySwitch>
        </Route>
      </FlatRoutes>,
    );

    expect(
      collected.map(p => ({
        id: p.id,
        extensions: toInternalBackstagePlugin(p).extensions.map(e => ({
          id: e.id,
          attachTo: e.attachTo,
          disabled: e.disabled,
          defaultConfig: e.configSchema?.parse({}),
        })),
      })),
    ).toEqual([
      {
        id: 'catalog',
        extensions: [
          {
            id: 'page:catalog',
            attachTo: { id: 'app/routes', input: 'routes' },
            disabled: false,
            defaultConfig: { path: 'catalog' },
          },
          {
            id: 'page:catalog/1',
            attachTo: { id: 'app/routes', input: 'routes' },
            defaultConfig: { path: 'catalog/:namespace/:kind/:name' },
            disabled: false,
          },
          {
            id: 'routing-shim:catalog/2',
            attachTo: {
              id: 'page:catalog/1',
              input: 'childRoutingShims',
            },
            defaultConfig: undefined,
            disabled: false,
          },
          {
            id: 'routing-shim:catalog/3',
            attachTo: {
              id: 'routing-shim:catalog/2',
              input: 'childRoutingShims',
            },
            defaultConfig: undefined,
            disabled: false,
          },
          {
            id: 'routing-shim:catalog/4',
            attachTo: {
              id: 'routing-shim:catalog/3',
              input: 'childRoutingShims',
            },
            defaultConfig: undefined,
            disabled: false,
          },
          {
            id: 'api:plugin.catalog.service',
            attachTo: {
              id: 'app',
              input: 'apis',
            },
            defaultConfig: undefined,
            disabled: false,
          },
          {
            id: 'api:catalog-react.starred-entities',
            attachTo: {
              id: 'app',
              input: 'apis',
            },
            defaultConfig: undefined,
            disabled: false,
          },
          {
            id: 'api:plugin.catalog.entity-presentation',
            attachTo: {
              id: 'app',
              input: 'apis',
            },
            defaultConfig: undefined,
            disabled: false,
          },
        ],
      },
      {
        id: 'score-card',
        extensions: [
          {
            id: 'api:plugin.scoringdata.service',
            attachTo: { id: 'app', input: 'apis' },
            disabled: false,
          },
        ],
      },
    ]);
  });

  it('should make legacy APIs available', async () => {
    const plugin = createPlugin({
      id: 'test',
    });
    const routeRef = createRouteRef({ id: 'test' });
    const Page = plugin.provide(
      createRoutableExtension({
        name: 'Test',
        mountPoint: routeRef,
        component: () =>
          Promise.resolve(() => {
            const app = useApp();
            return <div>plugins: {app.getPlugins().map(p => p.getId())}</div>;
          }),
      }),
    );

    const features = collectLegacyRoutes(
      <FlatRoutes>
        <Route path="/" element={<Page />} />
      </FlatRoutes>,
    );

    render(createSpecializedApp({ features }).createRoot());

    await expect(
      screen.findByText('plugins: test'),
    ).resolves.toBeInTheDocument();
  });

  it('should throw if invalid Route has been detected', async () => {
    const plugin = createPlugin({
      id: 'test',
    });
    const routeRef = createRouteRef({ id: 'test' });
    const Page = plugin.provide(
      createRoutableExtension({
        name: 'Test',
        mountPoint: routeRef,
        component: async () => () => {
          const app = useApp();
          return <div>plugins: {app.getPlugins().map(p => p.getId())}</div>;
        },
      }),
    );

    expect(() =>
      collectLegacyRoutes(
        <FlatRoutes>
          <Route path="/" element={<Page />} />
          <Route path="/" element={<Page />} />
          <div />
        </FlatRoutes>,
      ),
    ).toThrow(
      /Invalid element inside FlatRoutes, expected Route but found div./,
    );
  });

  it('should throw if invalid element has been detected', async () => {
    const plugin = createPlugin({
      id: 'test',
    });
    const routeRef = createRouteRef({ id: 'test' });
    const Page = plugin.provide(
      createRoutableExtension({
        name: 'Test',
        mountPoint: routeRef,
        component: async () => () => {
          const app = useApp();
          return <div>plugins: {app.getPlugins().map(p => p.getId())}</div>;
        },
      }),
    );

    expect(() =>
      collectLegacyRoutes(
        <FlatRoutes>
          <Route path="/" element={<Page />} />a string
        </FlatRoutes>,
      ),
    ).toThrow(
      /Invalid element inside FlatRoutes, expected Route but found element of type string./,
    );
  });

  it('should throw if <Route /> has no path', async () => {
    const plugin = createPlugin({
      id: 'test',
    });
    const routeRef = createRouteRef({ id: 'test' });
    const Page = plugin.provide(
      createRoutableExtension({
        name: 'Test',
        mountPoint: routeRef,
        component: () =>
          Promise.resolve(() => {
            const app = useApp();
            return <div>plugins: {app.getPlugins().map(p => p.getId())}</div>;
          }),
      }),
    );

    expect(() =>
      collectLegacyRoutes(
        <FlatRoutes>
          <Route element={<Page />} />
        </FlatRoutes>,
      ),
    ).toThrow(/Route element inside FlatRoutes had no path prop value given/);
  });

  it('should throw if element cannot be converted', async () => {
    expect(() =>
      collectLegacyRoutes(
        <FlatRoutes>
          <Route element={<Navigate to="/somewhere" />} />
        </FlatRoutes>,
      ),
    ).toThrow(
      /Route with path undefined has en element that can not be converted/,
    );
  });
});
