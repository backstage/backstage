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
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { BUIProvider } from '../../provider';
import { Header } from './Header';
import { HeaderMetadataStatus } from './HeaderMetadataStatus';
import { HeaderMetadataUsers } from './HeaderMetadataUsers';
import type { HeaderProps } from './types';

function LocationStatus() {
  return <span role="status">{useLocation().pathname}</span>;
}

function renderHeader(
  props: HeaderProps,
  initialEntry = '/app/catalog/entity',
) {
  return render(
    <MemoryRouter
      basename="/app"
      initialEntries={[initialEntry]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: false }}
    >
      <BUIProvider>
        <Routes>
          <Route
            path="catalog/entity/*"
            element={
              <>
                <Header title="Entity" {...props} />
                <LocationStatus />
              </>
            }
          />
        </Routes>
      </BUIProvider>
    </MemoryRouter>,
  );
}

describe('Header navigation', () => {
  it.each([
    {
      name: 'inline description link',
      props: { description: '[Description](description)' },
      linkName: 'Description',
      destination: 'description',
    },
    {
      name: 'tag link',
      props: { tags: [{ label: 'Tag', href: 'tag' }] },
      linkName: 'Tag',
      destination: 'tag',
    },
    {
      name: 'breadcrumb link',
      props: { breadcrumbs: [{ label: 'Parent', href: 'parent' }] },
      linkName: 'Parent',
      destination: 'parent',
    },
    {
      name: 'metadata status link',
      props: {
        metadata: [
          {
            label: 'Status',
            value: (
              <HeaderMetadataStatus
                label="Healthy"
                color="success"
                href="health"
              />
            ),
          },
        ],
      },
      linkName: 'Healthy',
      destination: 'health',
    },
    {
      name: 'metadata user link',
      props: {
        metadata: [
          {
            label: 'Owner',
            value: (
              <HeaderMetadataUsers
                users={[{ name: 'Ada Lovelace', href: 'owner' }]}
              />
            ),
          },
        ],
      },
      linkName: 'Ada Lovelace',
      destination: 'owner',
    },
  ] satisfies Array<{
    name: string;
    props: HeaderProps;
    linkName: string;
    destination: string;
  }>)(
    'routes the relative $name through the host router',
    ({ props, linkName, destination }) => {
      renderHeader(props);

      const link = screen.getByRole('link', { name: linkName });
      expect(link).toHaveAttribute(
        'href',
        `/app/catalog/entity/${destination}`,
      );
      fireEvent.click(link);
      expect(screen.getByRole('status')).toHaveTextContent(
        `/catalog/entity/${destination}`,
      );
    },
  );

  it('routes a relative flat tab through HeaderNav', () => {
    renderHeader({
      tabs: [{ id: 'overview', label: 'Overview', href: 'overview' }],
      activeTabId: null,
    });

    const link = screen.getByRole('link', { name: 'Overview' });
    expect(link).toHaveAttribute('href', '/app/catalog/entity/overview');
    fireEvent.click(link);
    expect(screen.getByRole('status')).toHaveTextContent(
      '/catalog/entity/overview',
    );
  });

  it('routes an empty flat tab href to the parent wildcard route', () => {
    renderHeader(
      {
        tabs: [{ id: 'overview', label: 'Overview', href: '' }],
        activeTabId: null,
      },
      '/app/catalog/entity/techdocs',
    );

    const link = screen.getByRole('link', { name: 'Overview' });
    expect(link).toHaveAttribute('href', '/app/catalog/entity');
    fireEvent.click(link);
    expect(screen.getByRole('status')).toHaveTextContent('/catalog/entity');
  });

  it('routes a relative grouped tab through its menu item', async () => {
    renderHeader({
      tabs: [
        {
          id: 'resources',
          label: 'Resources',
          items: [{ id: 'docs', label: 'TechDocs', href: 'docs' }],
        },
      ],
      activeTabId: null,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Resources' }));
    const link = await screen.findByRole('menuitemradio', {
      name: 'TechDocs',
    });
    expect(link).toHaveAttribute('href', '/app/catalog/entity/docs');
    fireEvent.click(link);
    expect(screen.getByRole('status')).toHaveTextContent(
      '/catalog/entity/docs',
    );
  });
});
