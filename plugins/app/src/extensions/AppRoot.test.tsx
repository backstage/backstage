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

import { render, screen } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import {
  PageBlueprint,
  createFrontendModule,
} from '@backstage/frontend-plugin-api';
import { SignInPageBlueprint } from '@backstage/plugin-app-react';
import { createApp } from '@backstage/frontend-defaults';
import { mockApis } from '@backstage/test-utils';
import { Link, Tab, TabList, TabPanel, Tabs } from '@backstage/ui';

const BASENAME_CONFIG = {
  app: { baseUrl: 'https://example.com/backstage' },
  backend: { baseUrl: 'http://localhost:7007' },
};

// BUI chrome that renders anchors through the react-aria router context that
// BUIProvider installs. `Link` resolves its own href, the rest rely on the
// `useHref` handed to BUIProvider.
function ChromeLinks() {
  return (
    <div>
      <Link href="/catalog">Catalog</Link>
      <Tabs>
        <TabList>
          <Tab id="overview" href="/catalog/overview">
            Overview
          </Tab>
        </TabList>
        <TabPanel id="overview">Overview panel</TabPanel>
      </Tabs>
    </div>
  );
}

async function expectBasenameHrefs() {
  await expect(
    screen.findByRole('link', { name: 'Catalog' }),
  ).resolves.toHaveAttribute('href', '/backstage/catalog');
  await expect(
    screen.findByRole('tab', { name: 'Overview' }),
  ).resolves.toHaveAttribute('href', '/backstage/catalog/overview');
}

describe('AppRoot', () => {
  it('should resolve BUI chrome hrefs through the app basename', async () => {
    const catalogPage = PageBlueprint.make({
      name: 'catalog',
      params: {
        path: '/catalog',
        loader: async () => <ChromeLinks />,
      },
    });

    renderTestApp({
      extensions: [catalogPage],
      initialRouteEntries: ['/catalog/overview'],
      config: BASENAME_CONFIG,
    });

    await expectBasenameHrefs();
  });

  // The sign-in branch is a second, separate BUIProvider render site, and it is
  // only reachable through a full app with a sign-in page rather than
  // renderTestApp, which finalizes without one.
  it('should resolve BUI chrome hrefs through the app basename while signing in', async () => {
    const app = createApp({
      advanced: {
        configLoader: async () => ({
          config: mockApis.config({ data: BASENAME_CONFIG }),
        }),
      },
      features: [
        createFrontendModule({
          pluginId: 'app',
          extensions: [
            SignInPageBlueprint.make({
              params: { loader: async () => () => <ChromeLinks /> },
            }),
          ],
        }),
      ],
    });

    render(app.createRoot());

    await expectBasenameHrefs();
  });
});
