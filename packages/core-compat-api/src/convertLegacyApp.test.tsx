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

import { AppRouter, FlatRoutes } from '@backstage/core-app-api';
import { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { convertLegacyAppRoot } from './convertLegacyApp';
import {
  createApiFactory,
  createApiRef,
  createComponentExtension,
  createPlugin,
  createRoutableExtension,
  createRouteRef,
} from '@backstage/core-plugin-api';
import { EntityLayout, EntitySwitch, isKind } from '@backstage/plugin-catalog';
import { renderTestApp } from '@backstage/frontend-test-utils';
import { default as catalogPlugin } from '@backstage/plugin-catalog/alpha';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';

const Root = ({ children }: { children: ReactNode }) => <>{children}</>;

const exampleApiRef = createApiRef<string>({
  id: 'plugin.example.service',
});
const examplePlugin1 = createPlugin({
  id: 'example-1',
  apis: [createApiFactory(exampleApiRef, 'example-api-1')],
});
const ExamplePage1 = examplePlugin1.provide(
  createRoutableExtension({
    name: 'ExamplePage1',
    mountPoint: createRouteRef({ id: 'example-1' }),
    component: () => Promise.resolve(() => <div>Example Page 1</div>),
  }),
);

const examplePlugin2 = createPlugin({
  id: 'example-2',
});
const ExamplePage2 = examplePlugin2.provide(
  createRoutableExtension({
    name: 'ExamplePage2',
    mountPoint: createRouteRef({ id: 'example-2' }),
    component: () => Promise.resolve(() => <div>Example Page 2</div>),
  }),
);

describe('convertLegacyApp', () => {
  it('should find and extract root and routes', () => {
    const collected = convertLegacyAppRoot(
      <>
        <div />
        <span />
        <AppRouter>
          <div />
          <Root>
            <FlatRoutes>
              <Route path="/example-1" element={<ExamplePage1 />} />
              <Route path="/example-2" element={<ExamplePage2 />} />
              <Route path="/example-2" element={<ExamplePage2 />} />
            </FlatRoutes>
          </Root>
        </AppRouter>
      </>,
    );

    expect(
      collected.map((p: any /* TODO */) => ({
        id: p.id,
        extensions: p.extensions.map((e: any) => ({
          id: e.id,
          attachTo: e.attachTo,
          disabled: e.disabled,
          defaultConfig: e.configSchema?.parse({}),
        })),
      })),
    ).toEqual([
      {
        id: 'example-1',
        extensions: [
          {
            id: 'page:example-1',
            attachTo: { id: 'app/routes', input: 'routes' },
            disabled: false,
            defaultConfig: {},
          },
          {
            id: 'api:example-1/plugin.example.service',
            attachTo: { id: 'root', input: 'apis' },
            disabled: false,
          },
        ],
      },
      {
        id: 'example-2',
        extensions: [
          {
            id: 'page:example-2',
            attachTo: { id: 'app/routes', input: 'routes' },
            disabled: false,
            defaultConfig: {},
          },
          {
            id: 'page:example-2/1',
            attachTo: { id: 'app/routes', input: 'routes' },
            disabled: false,
            defaultConfig: {},
          },
        ],
      },
      {
        id: undefined,
        extensions: [
          {
            id: 'app/layout',
            attachTo: { id: 'app/root', input: 'children' },
            disabled: false,
          },
          {
            id: 'app/nav',
            attachTo: { id: 'app/layout', input: 'nav' },
            disabled: true,
          },
        ],
      },
    ]);
  });

  it('should find and extract just routes', () => {
    const collected = convertLegacyAppRoot(
      <FlatRoutes>
        <Route path="/example-1" element={<ExamplePage1 />} />
        <Route path="/example-2" element={<ExamplePage2 />} />
        <Route path="/example-2" element={<ExamplePage2 />} />
      </FlatRoutes>,
    );

    expect(
      collected.map((p: any /* TODO */) => ({
        id: p.id,
        extensions: p.extensions.map((e: any) => ({
          id: e.id,
          attachTo: e.attachTo,
          disabled: e.disabled,
          defaultConfig: e.configSchema?.parse({}),
        })),
      })),
    ).toEqual([
      expect.objectContaining({
        id: 'example-1',
      }),
      expect.objectContaining({
        id: 'example-2',
      }),
    ]);
  });

  it('should convert entity pages', async () => {
    const fooPlugin = createPlugin({
      id: 'foo',
    });

    const FooContent = fooPlugin.provide(
      createComponentExtension({
        name: 'FooContent',
        component: { sync: () => <div>foo content</div> },
      }),
    );
    const OtherFooContent = fooPlugin.provide(
      createComponentExtension({
        name: 'OtherFooContent',
        component: { sync: () => <div>other foo content</div> },
      }),
    );

    const simpleTestContent = (
      <EntityLayout>
        <EntityLayout.Route path="/" title="Overview">
          <div>overview content</div>
        </EntityLayout.Route>
        <EntityLayout.Route path="/foo" title="Foo">
          <FooContent />
        </EntityLayout.Route>
        <EntityLayout.Route path="/bar" title="Bar">
          <div>bar content</div>
        </EntityLayout.Route>
      </EntityLayout>
    );

    const otherTestContent = (
      <EntityLayout>
        <EntityLayout.Route path="/" title="Overview">
          <div>other overview content</div>
        </EntityLayout.Route>
        <EntityLayout.Route path="/foo" title="Foo">
          <OtherFooContent />
        </EntityLayout.Route>
      </EntityLayout>
    );

    const entityPage = (
      <EntitySwitch>
        <EntitySwitch.Case if={isKind('test')}>
          {simpleTestContent}
        </EntitySwitch.Case>
        <EntitySwitch.Case>{otherTestContent}</EntitySwitch.Case>
      </EntitySwitch>
    );

    const converted = convertLegacyAppRoot(
      <FlatRoutes>
        <Route path="/test" element={<div>test</div>} />
      </FlatRoutes>,
      { entityPage },
    );

    const catalogOverride = catalogPlugin.withOverrides({
      extensions: [
        catalogPlugin.getExtension('api:catalog').override({
          params: defineParams =>
            defineParams({
              api: catalogApiRef,
              deps: {},
              factory: () =>
                catalogApiMock({
                  entities: [
                    {
                      apiVersion: 'backstage.io/v1alpha1',
                      kind: 'test',
                      metadata: {
                        name: 'x',
                      },
                      spec: {},
                    },
                    {
                      apiVersion: 'backstage.io/v1alpha1',
                      kind: 'other',
                      metadata: {
                        name: 'x',
                      },
                      spec: {},
                    },
                  ],
                }),
            }),
        }),
      ],
    });

    // Increase timeout for async rendering of complex catalog entity pages
    const findOptions = { timeout: 5000 };

    // Overview
    const renderOverviewTest = await renderTestApp({
      features: [catalogOverride, ...converted],
      initialRouteEntries: ['/catalog/default/test/x'],
    });
    await expect(
      renderOverviewTest.findByText('overview content', {}, findOptions),
    ).resolves.toBeInTheDocument();
    renderOverviewTest.unmount();

    const renderOverviewOther = await renderTestApp({
      features: [catalogOverride, ...converted],
      initialRouteEntries: ['/catalog/default/other/x'],
    });
    await expect(
      renderOverviewOther.findByText('other overview content', {}, findOptions),
    ).resolves.toBeInTheDocument();
    renderOverviewOther.unmount();

    // Foo tab
    const renderFooTest = await renderTestApp({
      features: [catalogOverride, ...converted],
      initialRouteEntries: ['/catalog/default/test/x/foo'],
    });
    await expect(
      renderFooTest.findByText('foo content', {}, findOptions),
    ).resolves.toBeInTheDocument();
    renderFooTest.unmount();

    const renderFooOther = await renderTestApp({
      features: [catalogOverride, ...converted],
      initialRouteEntries: ['/catalog/default/other/x/foo'],
    });
    await expect(
      renderFooOther.findByText('other foo content', {}, findOptions),
    ).resolves.toBeInTheDocument();
    renderFooOther.unmount();

    // Bar tab
    const renderBarTest = await renderTestApp({
      features: [catalogOverride, ...converted],
      initialRouteEntries: ['/catalog/default/test/x/bar'],
    });
    await expect(
      renderBarTest.findByText('bar content', {}, findOptions),
    ).resolves.toBeInTheDocument();
    renderBarTest.unmount();

    const renderBarOther = await renderTestApp({
      features: [catalogOverride, ...converted],
      initialRouteEntries: ['/catalog/default/other/x/bar'],
    });
    await expect(
      renderBarOther.findByText('other overview content', {}, findOptions),
    ).resolves.toBeInTheDocument(); // /bar does not exist, fall back to rendering overview
    renderBarOther.unmount();
  });
});
