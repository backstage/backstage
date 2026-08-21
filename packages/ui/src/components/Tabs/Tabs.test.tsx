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
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { BUIProvider, type BUIRouter } from '../../provider';
import { Tab, TabList, Tabs } from './Tabs';

describe('Tabs', () => {
  it('selects routed tabs from the injected router without React Router context', async () => {
    const router: BUIRouter = {
      navigate: jest.fn(),
      useHref: href => href,
      useLocation: () => ({
        pathname: '/catalog/entity/overview/details',
        search: '',
        hash: '',
      }),
    };

    render(
      <BUIProvider router={router}>
        <Tabs>
          <TabList>
            <Tab
              id="overview"
              href="/catalog/entity/overview"
              matchStrategy="prefix"
            >
              Overview
            </Tab>
            <Tab
              id="settings"
              href="/catalog/entity/settings"
              matchStrategy="prefix"
            >
              Settings
            </Tab>
          </TabList>
        </Tabs>
      </BUIProvider>,
    );

    expect(
      await screen.findByRole('tab', { name: 'Overview' }),
    ).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('resolves relative routed tabs through the injected router for active selection', async () => {
    const router: BUIRouter = {
      navigate: jest.fn(),
      useHref: href =>
        href.startsWith('/') ? `/app${href}` : `/app/catalog/${href}`,
      useLocation: () => ({
        pathname: '/catalog/settings/details',
        search: '',
        hash: '',
      }),
    };

    render(
      <BUIProvider router={router}>
        <Tabs>
          <TabList>
            <Tab id="overview" href="overview" matchStrategy="prefix">
              Overview
            </Tab>
            <Tab id="settings" href="settings" matchStrategy="prefix">
              Settings
            </Tab>
          </TabList>
        </Tabs>
      </BUIProvider>,
    );

    expect(
      await screen.findByRole('tab', { name: 'Settings' }),
    ).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/app/catalog/settings',
    );
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('keeps ambient React Router basename and relative-route selection', async () => {
    render(
      <MemoryRouter
        basename="/app"
        initialEntries={['/app/catalog/settings/details']}
      >
        <BUIProvider>
          <Routes>
            <Route
              path="/catalog/*"
              element={
                <Tabs>
                  <TabList>
                    <Tab id="overview" href="overview" matchStrategy="prefix">
                      Overview
                    </Tab>
                    <Tab id="settings" href="settings" matchStrategy="prefix">
                      Settings
                    </Tab>
                  </TabList>
                </Tabs>
              }
            />
          </Routes>
        </BUIProvider>
      </MemoryRouter>,
    );

    expect(
      await screen.findByRole('tab', { name: 'Settings' }),
    ).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/app/catalog/settings',
    );
  });
});
