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

import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BUIProvider } from '../../provider';
import { PluginHeaderBreadcrumbs } from './PluginHeaderBreadcrumbs';
import type { PluginHeaderBreadcrumbEntry } from './types';

function renderBreadcrumbs(entries: PluginHeaderBreadcrumbEntry[]) {
  return render(
    <MemoryRouter>
      <BUIProvider>
        <PluginHeaderBreadcrumbs entries={entries} />
      </BUIProvider>
    </MemoryRouter>,
  );
}

function simulateTruncation() {
  const scrollWidthSpy = jest
    .spyOn(HTMLElement.prototype, 'scrollWidth', 'get')
    .mockReturnValue(200);
  const clientWidthSpy = jest
    .spyOn(HTMLElement.prototype, 'clientWidth', 'get')
    .mockReturnValue(100);
  return () => {
    scrollWidthSpy.mockRestore();
    clientWidthSpy.mockRestore();
  };
}

describe('PluginHeaderBreadcrumbs', () => {
  it('renders nothing when entries is empty', () => {
    const { container } = renderBreadcrumbs([]);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders a single entry as a clickable link', () => {
    renderBreadcrumbs([{ label: 'Catalog', href: '/catalog' }]);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Catalog' });
    expect(link).toHaveAttribute('href', '/catalog');
  });

  it('renders the last entry as plain text and ancestors as links', () => {
    renderBreadcrumbs([
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services' },
      { label: 'my-service', href: '/services/my-service' },
    ]);

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

  it('renders separators between ancestor segments', () => {
    renderBreadcrumbs([
      { label: 'Home', href: '/' },
      { label: 'Settings', href: '/settings' },
      { label: 'Theme', href: '/settings/theme' },
    ]);

    const svgs = screen
      .getByRole('navigation')
      .querySelectorAll('[aria-hidden="true"] svg');
    expect(svgs.length).toBe(2);
  });

  it('does not render a separator after the current entry', () => {
    renderBreadcrumbs([
      { label: 'Home', href: '/' },
      { label: 'Current', href: '/current' },
    ]);

    const items = screen.getByRole('list').querySelectorAll('li');
    const lastItem = items[items.length - 1];
    expect(lastItem.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  describe('collapsing behaviour', () => {
    it('collapses middle items when there are 5 or more entries', () => {
      renderBreadcrumbs([
        { label: 'Root', href: '/' },
        { label: 'A', href: '/a' },
        { label: 'B', href: '/b' },
        { label: 'C', href: '/c' },
        { label: 'Current', href: '/current' },
      ]);

      expect(screen.getByRole('link', { name: 'Root' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'C' })).toBeInTheDocument();
      expect(screen.getByText('Current')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Show more breadcrumbs' }),
      ).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'A' })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'B' })).not.toBeInTheDocument();
    });

    it('does not collapse items when there are fewer than 5 entries', () => {
      renderBreadcrumbs([
        { label: 'Root', href: '/' },
        { label: 'A', href: '/a' },
        { label: 'B', href: '/b' },
        { label: 'Current', href: '/current' },
      ]);

      expect(screen.getByRole('link', { name: 'Root' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'A' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'B' })).toBeInTheDocument();
      expect(screen.getByText('Current')).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Show more breadcrumbs' }),
      ).not.toBeInTheDocument();
    });

    it('preserves root and leading items when collapsing', () => {
      renderBreadcrumbs([
        { label: 'Root', href: '/' },
        { label: 'Hidden-1', href: '/h1' },
        { label: 'Hidden-2', href: '/h2' },
        { label: 'Leading', href: '/leading' },
        { label: 'Current', href: '/current' },
      ]);

      expect(screen.getByRole('link', { name: 'Root' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Leading' })).toBeInTheDocument();
      expect(screen.getByText('Current')).toBeInTheDocument();
      expect(
        screen.queryByRole('link', { name: 'Hidden-1' }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('link', { name: 'Hidden-2' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('truncation and tooltips', () => {
    it('shows a tooltip on a truncated ancestor link on hover', async () => {
      const restore = simulateTruncation();

      renderBreadcrumbs([
        { label: 'A very long breadcrumb name', href: '/long' },
        { label: 'Current', href: '/current' },
      ]);

      const link = screen.getByRole('link', {
        name: 'A very long breadcrumb name',
      });
      await act(async () => {
        link.focus();
      });

      expect(
        await screen.findByRole('tooltip', {
          name: 'A very long breadcrumb name',
        }),
      ).toBeInTheDocument();

      restore();
    });

    it('does not show a tooltip when text is not truncated', async () => {
      renderBreadcrumbs([
        { label: 'Short', href: '/short' },
        { label: 'Current', href: '/current' },
      ]);

      const link = screen.getByRole('link', { name: 'Short' });
      await act(async () => {
        link.focus();
      });

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });
});
