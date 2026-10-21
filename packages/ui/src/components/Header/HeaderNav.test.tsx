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

import { fireEvent, render, screen } from '@testing-library/react';
import { createVersionedValueMap } from '@backstage/version-bridge';
import {
  Link as RouterLink,
  MemoryRouter,
  Route,
  Routes,
  useHref,
  useInRouterContext,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom';
import { BUIProvider } from '../../provider';
import { BUIContext } from '../../provider/BUIContext';
import type { BUIRoutingIntegration } from '../../navigation/types';
import { HeaderNav } from './HeaderNav';
import { useMemo, type ComponentProps, type PropsWithChildren } from 'react';

function renderHeaderNav(
  props: ComponentProps<typeof HeaderNav>,
  initialEntry = '/app/catalog',
) {
  return render(
    <MemoryRouter
      basename="/app"
      initialEntries={[initialEntry]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route
          path="catalog/*"
          element={
            <BUIProvider>
              <HeaderNav {...props} />
              <LocationStatus />
            </BUIProvider>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

function LocationStatus() {
  return <span role="status">{useLocation().pathname}</span>;
}

describe('HeaderNav', () => {
  it('includes the router basename in flat tab hrefs', () => {
    renderHeaderNav({
      tabs: [
        {
          id: 'overview',
          label: 'Overview',
          href: '/catalog/overview',
        },
      ],
      activeTabId: null,
    });

    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute(
      'href',
      '/app/catalog/overview',
    );
  });

  it('automatically detects the active flat tab under a router basename', () => {
    renderHeaderNav(
      {
        tabs: [
          {
            id: 'overview',
            label: 'Overview',
            href: '/catalog/overview',
          },
          {
            id: 'settings',
            label: 'Settings',
            href: '/catalog/settings',
          },
        ],
      },
      '/app/catalog/overview/details',
    );

    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'Settings' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('ignores query and hash values when automatically detecting the active tab', () => {
    renderHeaderNav(
      {
        tabs: [
          {
            id: 'overview',
            label: 'Overview',
            href: '/catalog/overview?tab=docs#api',
          },
          {
            id: 'settings',
            label: 'Settings',
            href: '/catalog/settings',
          },
        ],
      },
      '/app/catalog/overview?view=grid#details',
    );

    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'Settings' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('automatically selects the most-specific tab for a nested path', () => {
    renderHeaderNav(
      {
        tabs: [
          { id: 'catalog', label: 'Catalog', href: '/catalog' },
          { id: 'users', label: 'Users', href: '/catalog/users' },
        ],
      },
      '/app/catalog/users/ada/details',
    );

    expect(screen.getByRole('link', { name: 'Users' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'Catalog' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('includes the router basename in grouped tab hrefs', async () => {
    renderHeaderNav({
      tabs: [
        {
          id: 'resources',
          label: 'Resources',
          items: [
            {
              id: 'docs',
              label: 'TechDocs',
              href: '/catalog/docs',
            },
          ],
        },
      ],
      activeTabId: null,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Resources' }));

    expect(
      await screen.findByRole('menuitemradio', { name: 'TechDocs' }),
    ).toHaveAttribute('href', '/app/catalog/docs');
  });

  it('resolves a nested relative flat tab and navigates client-side', () => {
    renderHeaderNav({
      tabs: [
        {
          id: 'overview',
          label: 'Overview',
          href: 'overview',
        },
      ],
      activeTabId: null,
    });

    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute(
      'href',
      '/app/catalog/overview',
    );
    fireEvent.click(screen.getByRole('link', { name: 'Overview' }));
    expect(screen.getByRole('status')).toHaveTextContent('/catalog/overview');
  });

  it('navigates grouped items client-side', async () => {
    renderHeaderNav({
      tabs: [
        {
          id: 'resources',
          label: 'Resources',
          items: [
            {
              id: 'docs',
              label: 'TechDocs',
              href: '/catalog/docs',
            },
          ],
        },
      ],
      activeTabId: null,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Resources' }));
    fireEvent.click(
      await screen.findByRole('menuitemradio', { name: 'TechDocs' }),
    );
    expect(screen.getByRole('status')).toHaveTextContent('/catalog/docs');
  });

  it('retains external grouped item target defaults', async () => {
    renderHeaderNav({
      tabs: [
        {
          id: 'resources',
          label: 'Resources',
          items: [
            {
              id: 'docs',
              label: 'External docs',
              href: 'https://example.test/docs',
            },
          ],
        },
      ],
      activeTabId: null,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Resources' }));
    const item = await screen.findByRole('menuitemradio', {
      name: 'External docs',
    });
    expect(item).toHaveAttribute('target', '_blank');
    expect(item).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('preserves aria-current and the registered anchor ref', () => {
    renderHeaderNav({
      tabs: [
        {
          id: 'overview',
          label: 'Overview',
          href: '/catalog/overview',
        },
      ],
      activeTabId: 'overview',
    });

    const link = screen.getByRole('link', { name: 'Overview' });
    const navigation = screen.getByRole('navigation', {
      name: 'Content navigation',
    });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(navigation.style.getPropertyValue('--active-tab-opacity')).toBe('1');
  });

  it('registers flat navigation with the selected routing integration', () => {
    const createRouterOptions = jest.fn(() => ({ replace: true }));
    render(
      <MemoryRouter
        basename="/app"
        initialEntries={['/app/catalog']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <TrackingRoutingProvider createRouterOptions={createRouterOptions}>
          <HeaderNav
            tabs={[
              {
                id: 'overview',
                label: 'Overview',
                href: '/catalog/overview',
              },
            ]}
            activeTabId={null}
          />
        </TrackingRoutingProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute(
      'href',
      '/app/catalog/overview',
    );
    expect(createRouterOptions).toHaveBeenCalledTimes(1);
  });
});

function TrackingRoutingProvider({
  children,
  createRouterOptions,
}: PropsWithChildren<{
  createRouterOptions: BUIRoutingIntegration['createRouterOptions'];
}>) {
  const routing = useMemo<BUIRoutingIntegration>(
    () => ({
      Link: RouterLink,
      useHref,
      useInRouterContext,
      useLocation,
      useNavigate,
      useResolvedPath,
      createRouterOptions,
    }),
    [createRouterOptions],
  );
  const value = useMemo(
    () => createVersionedValueMap({ 1: {}, 2: { routing } }),
    [routing],
  );
  return <BUIContext.Provider value={value}>{children}</BUIContext.Provider>;
}
