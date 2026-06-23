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
import type { PluginHeaderProps } from './types';

function renderPluginHeader(props: PluginHeaderProps = {}, initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <BUIProvider>
        <PluginHeader {...props} />
      </BUIProvider>
    </MemoryRouter>,
  );
}

describe('PluginHeader', () => {
  it('renders the default title when none is provided', () => {
    renderPluginHeader();

    expect(
      screen.getByRole('heading', { name: 'Your plugin' }),
    ).toBeInTheDocument();
  });

  it('renders a custom title', () => {
    renderPluginHeader({ title: 'Catalog' });

    expect(
      screen.getByRole('heading', { name: 'Catalog' }),
    ).toBeInTheDocument();
  });

  it('renders the title as a link when titleLink is provided', () => {
    renderPluginHeader({ title: 'Catalog', titleLink: '/catalog' });

    const link = screen.getByRole('link', { name: 'Catalog' });
    expect(link).toHaveAttribute('href', '/catalog');
  });

  it('renders a custom icon', () => {
    renderPluginHeader({
      title: 'Catalog',
      icon: <svg data-testid="custom-icon" />,
    });

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders custom actions', () => {
    renderPluginHeader({
      title: 'Catalog',
      customActions: <button>Do thing</button>,
    });

    expect(
      screen.getByRole('button', { name: 'Do thing' }),
    ).toBeInTheDocument();
  });

  it('renders tabs when provided', () => {
    renderPluginHeader(
      {
        title: 'Catalog',
        tabs: [
          { id: 'overview', label: 'Overview', href: '/overview' },
          { id: 'settings', label: 'Settings', href: '/settings' },
        ],
      },
      '/overview',
    );

    expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Settings' })).toBeInTheDocument();
  });

  it('renders a single breadcrumb (plugin root page) as a clickable link', () => {
    renderPluginHeader({
      title: 'Catalog',
      breadcrumbs: [{ label: 'Catalog', href: '/catalog' }],
    });

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Catalog' });
    expect(link).toHaveAttribute('href', '/catalog');
  });

  it('renders breadcrumbs as a navigation trail', () => {
    renderPluginHeader({
      title: 'Catalog',
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'my-service', href: '/services/my-service' },
      ],
    });

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/',
    );
    expect(screen.getByRole('link', { name: 'Services' })).toHaveAttribute(
      'href',
      '/services',
    );
    expect(screen.getByText('my-service')).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'my-service' }),
    ).not.toBeInTheDocument();
  });

  it('visually hides the title when breadcrumbs are present', () => {
    renderPluginHeader({
      title: 'Catalog',
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Catalog', href: '/catalog' },
      ],
    });

    const headings = screen.getAllByRole('heading', { name: 'Catalog' });
    expect(headings.length).toBeGreaterThanOrEqual(1);
  });

  it('does not render tabs section when tabs array is empty', () => {
    renderPluginHeader({ title: 'Catalog', tabs: [] });

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  it('collapses middle breadcrumb items when there are 5 or more', async () => {
    renderPluginHeader({
      title: 'Introduction',
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Docs', href: '/docs' },
        { label: 'Guides', href: '/docs/guides' },
        { label: 'Setup', href: '/docs/guides/setup' },
        { label: 'Introduction', href: '/docs/guides/setup/introduction' },
      ],
    });

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Setup' })).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toHaveTextContent('Introduction');
    expect(
      screen.getByRole('button', { name: 'Show more breadcrumbs' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Docs' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Guides' }),
    ).not.toBeInTheDocument();
  });

  it('does not collapse breadcrumbs when there are fewer than 5', () => {
    renderPluginHeader({
      title: 'Theme',
      breadcrumbs: [
        { label: 'Home', href: '/' },
        { label: 'Settings', href: '/settings' },
        { label: 'Theme', href: '/settings/theme' },
      ],
    });

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toHaveTextContent('Theme');
    expect(
      screen.queryByRole('button', { name: 'Show more breadcrumbs' }),
    ).not.toBeInTheDocument();
  });
});
