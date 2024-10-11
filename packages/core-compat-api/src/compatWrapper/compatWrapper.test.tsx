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

import React from 'react';
import {
  componentsApiRef,
  coreComponentRefs,
  coreExtensionData,
  createExtension,
  iconsApiRef,
  useRouteRef as useNewRouteRef,
  createRouteRef as createNewRouteRef,
  useApi,
} from '@backstage/frontend-plugin-api';
import {
  createExtensionTester,
  renderInTestApp as renderInNewTestApp,
} from '@backstage/frontend-test-utils';
import { screen } from '@testing-library/react';
import { compatWrapper } from './compatWrapper';
import {
  useApp,
  useRouteRef as useOldRouteRef,
  createRouteRef as createOldRouteRef,
} from '@backstage/core-plugin-api';
import { convertLegacyRouteRef } from '../convertLegacyRouteRef';
import { renderInTestApp as renderInOldTestApp } from '@backstage/test-utils';

describe('BackwardsCompatProvider', () => {
  it('should convert the app context', () => {
    // TODO(Rugvip): Replace with the new renderInTestApp once it's available, and have some plugins
    renderInNewTestApp(
      createExtensionTester(
        createExtension({
          attachTo: { id: 'ignored', input: 'ignored' },
          output: [coreExtensionData.reactElement],
          factory() {
            function Component() {
              const app = useApp();
              return (
                <div data-testid="ctx">
                  plugins:{' '}
                  {app
                    .getPlugins()
                    .map(p => p.getId())
                    .join(', ')}
                  {'\n'}
                  components: {Object.keys(app.getComponents()).join(', ')}
                  {'\n'}
                  icons: {Object.keys(app.getSystemIcons()).join(', ')}
                </div>
              );
            }

            return [
              coreExtensionData.reactElement(compatWrapper(<Component />)),
            ];
          },
        }),
      ).reactElement(),
    );

    expect(screen.getByTestId('ctx').textContent).toMatchInlineSnapshot(`
      "plugins: test, app
      components: NotFoundErrorPage, BootErrorPage, Progress, Router, ErrorBoundaryFallback
      icons: brokenImage, catalog, scaffolder, techdocs, search, chat, dashboard, docs, email, github, group, help, kind:api, kind:component, kind:domain, kind:group, kind:location, kind:system, kind:user, kind:resource, kind:template, user, warning, star, unstarred, externalLink"
    `);
  });

  it('should convert the routing context', () => {
    const routeRef = createOldRouteRef({ id: 'test' });

    function Component() {
      const link = useOldRouteRef(routeRef);
      return <div>link: {link()}</div>;
    }

    renderInNewTestApp(compatWrapper(<Component />), {
      mountedRoutes: { '/test': convertLegacyRouteRef(routeRef) },
    });

    expect(screen.getByText('link: /test')).toBeInTheDocument();
  });
});

describe('ForwardsCompatProvider', () => {
  it('should convert the app context', async () => {
    function Component() {
      const components = useApi(componentsApiRef);
      const icons = useApi(iconsApiRef);
      return (
        <div data-testid="ctx">
          components:{' '}
          {Object.entries(coreComponentRefs)
            .map(
              ([name, ref]) =>
                `${name}=${Boolean(components.getComponent(ref))}`,
            )
            .join(', ')}
          {'\n'}
          icons: {icons.listIconKeys().join(', ')}
        </div>
      );
    }

    await renderInOldTestApp(compatWrapper(<Component />));

    expect(screen.getByTestId('ctx').textContent).toMatchInlineSnapshot(`
      "components: progress=true, notFoundErrorPage=true, errorBoundaryFallback=true
      icons: kind:api, kind:component, kind:domain, kind:group, kind:location, kind:system, kind:user, kind:resource, kind:template, brokenImage, catalog, scaffolder, techdocs, search, chat, dashboard, docs, email, github, group, help, user, warning, star, unstarred"
    `);
  });

  it('should convert the routing context', async () => {
    const routeRef = createNewRouteRef();

    function Component() {
      const link = useNewRouteRef(routeRef);
      return <div>link: {link?.()}</div>;
    }

    await renderInOldTestApp(compatWrapper(<Component />), {
      mountedRoutes: { '/test': convertLegacyRouteRef(routeRef) },
    });

    expect(screen.getByText('link: /test')).toBeInTheDocument();
  });
});
