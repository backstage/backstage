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
import { PuppetDbPage } from '@backstage-community/plugin-puppetdb';
import { StackstormPage } from '@backstage-community/plugin-stackstorm';
import { ScoreBoardPage } from '@oriflame/backstage-plugin-score-card';
import React, { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { convertLegacyApp } from './convertLegacyApp';
import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
} from '@backstage/core-plugin-api';
import { EntityLayout, EntitySwitch, isKind } from '@backstage/plugin-catalog';
import { renderInTestApp } from '@backstage/frontend-test-utils';
import { default as catalogPlugin } from '@backstage/plugin-catalog/alpha';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';

const Root = ({ children }: { children: ReactNode }) => <>{children}</>;

describe('convertLegacyApp', () => {
  it('should find and extract root and routes', () => {
    const collected = convertLegacyApp(
      <>
        <div />
        <span />
        <AppRouter>
          <div />
          <Root>
            <FlatRoutes>
              <Route path="/score-board" element={<ScoreBoardPage />} />
              <Route path="/stackstorm" element={<StackstormPage />} />
              <Route path="/puppetdb" element={<PuppetDbPage />} />
              <Route path="/puppetdb" element={<PuppetDbPage />} />
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
        id: 'score-card',
        extensions: [
          {
            id: 'page:score-card',
            attachTo: { id: 'app/routes', input: 'routes' },
            disabled: false,
            defaultConfig: {},
          },
          {
            id: 'api:score-card/plugin.scoringdata.service',
            attachTo: { id: 'root', input: 'apis' },
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
            defaultConfig: {},
          },
          {
            id: 'api:stackstorm/plugin.stackstorm.service',
            attachTo: { id: 'root', input: 'apis' },
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
            defaultConfig: {},
          },
          {
            id: 'page:puppetDb/1',
            attachTo: { id: 'app/routes', input: 'routes' },
            disabled: false,
            defaultConfig: {},
          },
          {
            id: 'api:puppetDb/plugin.puppetdb.service',
            attachTo: { id: 'root', input: 'apis' },
            disabled: false,
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
    const collected = convertLegacyApp(
      <FlatRoutes>
        <Route path="/score-board" element={<ScoreBoardPage />} />
        <Route path="/stackstorm" element={<StackstormPage />} />
        <Route path="/puppetdb" element={<PuppetDbPage />} />
        <Route path="/puppetdb" element={<PuppetDbPage />} />
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
        id: 'score-card',
      }),
      expect.objectContaining({
        id: 'stackstorm',
      }),
      expect.objectContaining({
        id: 'puppetDb',
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

    const converted = convertLegacyApp(
      <FlatRoutes>
        <Route path="/test" element={<div>test</div>} />
      </FlatRoutes>,
      { entityPage },
    );

    const catalogOverride = catalogPlugin.withOverrides({
      extensions: [
        catalogPlugin.getExtension('api:catalog').override({
          params: {
            factory: createApiFactory(
              catalogApiRef,
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
            ),
          },
        }),
      ],
    });

    // Overview
    const renderOverviewTest = await renderInTestApp(<div />, {
      features: [catalogOverride, ...converted],
      initialRouteEntries: ['/catalog/default/test/x'],
    });
    await expect(
      renderOverviewTest.findByText('overview content'),
    ).resolves.toBeInTheDocument();
    renderOverviewTest.unmount();

    const renderOverviewOther = await renderInTestApp(<div />, {
      features: [catalogOverride, ...converted],
      initialRouteEntries: ['/catalog/default/other/x'],
    });
    await expect(
      renderOverviewOther.findByText('other overview content'),
    ).resolves.toBeInTheDocument();
    renderOverviewOther.unmount();

    // Foo tab
    const renderFooTest = await renderInTestApp(<div />, {
      features: [catalogOverride, ...converted],
      initialRouteEntries: ['/catalog/default/test/x/foo'],
    });
    await expect(
      renderFooTest.findByText('foo content'),
    ).resolves.toBeInTheDocument();
    renderFooTest.unmount();

    const renderFooOther = await renderInTestApp(<div />, {
      features: [catalogOverride, ...converted],
      initialRouteEntries: ['/catalog/default/other/x/foo'],
    });
    await expect(
      renderFooOther.findByText('other foo content'),
    ).resolves.toBeInTheDocument();
    renderFooOther.unmount();

    // Bar tab
    const renderBarTest = await renderInTestApp(<div />, {
      features: [catalogOverride, ...converted],
      initialRouteEntries: ['/catalog/default/test/x/bar'],
    });
    await expect(
      renderBarTest.findByText('bar content'),
    ).resolves.toBeInTheDocument();
    renderBarTest.unmount();

    const renderBarOther = await renderInTestApp(<div />, {
      features: [catalogOverride, ...converted],
      initialRouteEntries: ['/catalog/default/other/x/bar'],
    });
    await expect(
      renderBarOther.findByText('other overview content'),
    ).resolves.toBeInTheDocument(); // /bar does not exist, fall back to rendering overview
    renderBarOther.unmount();
  });
});
