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
import { MemoryRouter } from 'react-router-dom';
import { BUIProvider } from '../../provider';
import { PluginHeader } from './PluginHeader';
import type { BreadcrumbEntry, HeaderTab } from './types';

function renderPluginHeader(
  props: React.ComponentProps<typeof PluginHeader> = {},
) {
  return render(
    <MemoryRouter>
      <BUIProvider>
        <PluginHeader {...props} />
      </BUIProvider>
    </MemoryRouter>,
  );
}

describe('PluginHeader', () => {
  it('renders the default title and icon when no props are given', () => {
    renderPluginHeader();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Your plugin',
    );
  });

  it('renders a custom title', () => {
    renderPluginHeader({ title: 'My Plugin' });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'My Plugin',
    );
  });

  it('renders the title as a link when titleLink is provided', () => {
    renderPluginHeader({ title: 'Linked Plugin', titleLink: '/plugin' });

    const link = screen.getByRole('link', { name: 'Linked Plugin' });
    expect(link).toHaveAttribute('href', '/plugin');
  });

  it('renders breadcrumbs inside the heading when breadcrumbs are provided', () => {
    const breadcrumbs: BreadcrumbEntry[] = [
      { label: 'Home', href: '/' },
      { label: 'Docs', href: '/docs' },
      { label: 'Getting Started', href: '/docs/getting-started' },
    ];

    renderPluginHeader({ breadcrumbs });

    expect(screen.getByRole('navigation')).toHaveAttribute(
      'aria-label',
      'Breadcrumbs',
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Docs')).toBeInTheDocument();
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('still renders the icon when breadcrumbs are provided', () => {
    const { container } = renderPluginHeader({
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Current', href: '/current' },
      ],
    });

    expect(
      container.querySelector('.bui-PluginHeaderToolbarIcon'),
    ).toBeInTheDocument();
  });

  it('renders custom actions alongside breadcrumbs', () => {
    renderPluginHeader({
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Current', href: '/current' },
      ],
      customActions: <button>Action</button>,
    });

    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders breadcrumbs together with tabs', () => {
    const breadcrumbs: BreadcrumbEntry[] = [
      { label: 'Home', href: '/' },
      { label: 'Docs', href: '/docs' },
    ];
    const tabs: HeaderTab[] = [
      { id: 'overview', label: 'Overview', href: '/overview' },
      { id: 'details', label: 'Details', href: '/details' },
    ];

    renderPluginHeader({ breadcrumbs, tabs });

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('falls back to the regular title when breadcrumbs is an empty array', () => {
    renderPluginHeader({ title: 'Fallback Title', breadcrumbs: [] });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Fallback Title',
    );
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });
});
