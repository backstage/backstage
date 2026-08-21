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
import { MemoryRouter } from 'react-router-dom';
import { BUIProvider, type BUIRouter } from '../../provider';
import { HeaderNav } from './HeaderNav';
import type { ComponentProps } from 'react';

function renderHeaderNav(
  props: ComponentProps<typeof HeaderNav>,
  initialEntry = '/app/catalog',
) {
  return render(
    <MemoryRouter basename="/app" initialEntries={[initialEntry]}>
      <BUIProvider>
        <HeaderNav {...props} />
      </BUIProvider>
    </MemoryRouter>,
  );
}

describe('HeaderNav', () => {
  it('detects the active tab through an injected router without React Router context', () => {
    const router: BUIRouter = {
      navigate: jest.fn(),
      useHref: href => `/app${href}`,
      useLocation: () => ({
        pathname: '/catalog/settings/details',
        search: '',
        hash: '',
      }),
    };

    render(
      <BUIProvider router={router}>
        <HeaderNav
          tabs={[
            { id: 'overview', label: 'Overview', href: '/catalog/overview' },
            { id: 'settings', label: 'Settings', href: '/catalog/settings' },
            {
              id: 'external-settings',
              label: 'External settings',
              href: 'https://example.com/catalog/settings',
            },
          ]}
        />
      </BUIProvider>,
    );

    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'Overview' })).not.toHaveAttribute(
      'aria-current',
    );
    expect(
      screen.getByRole('link', { name: 'External settings' }),
    ).not.toHaveAttribute('aria-current');
  });

  it('resolves relative flat tabs through the injected router when detecting the active tab', () => {
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
        <HeaderNav
          tabs={[
            { id: 'overview', label: 'Overview', href: 'overview' },
            { id: 'settings', label: 'Settings', href: 'settings' },
          ]}
        />
      </BUIProvider>,
    );

    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/app/catalog/settings',
    );
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'Overview' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('resolves relative grouped tabs through the injected router when detecting the active tab', async () => {
    const router: BUIRouter = {
      navigate: jest.fn(),
      useHref: href =>
        href.startsWith('/') ? `/app${href}` : `/app/catalog/${href}`,
      useLocation: () => ({
        pathname: '/catalog/docs/details',
        search: '',
        hash: '',
      }),
    };

    render(
      <BUIProvider router={router}>
        <HeaderNav
          tabs={[
            {
              id: 'resources',
              label: 'Resources',
              items: [
                { id: 'overview', label: 'Overview', href: 'overview' },
                { id: 'docs', label: 'Docs', href: 'docs' },
              ],
            },
          ]}
        />
      </BUIProvider>,
    );

    expect(screen.getByRole('button', { name: 'Resources' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Resources' }));
    expect(
      await screen.findByRole('menuitemradio', { name: 'Docs' }),
    ).toHaveAttribute('href', '/app/catalog/docs');
  });

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
});
