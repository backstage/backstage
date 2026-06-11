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

import { type PropsWithChildren } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PluginHeaderBreadcrumbs } from './PluginHeaderBreadcrumbs';
import { BUIProvider } from '../../provider';

const originalWarn = console.warn.bind(console);
const originalResizeObserver = global.ResizeObserver;

beforeAll(() => {
  global.ResizeObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })) as unknown as typeof ResizeObserver;

  jest.spyOn(console, 'warn').mockImplementation((msg: unknown, ...args) => {
    if (typeof msg === 'string' && msg.includes('<Focusable>')) return;
    originalWarn(msg, ...args);
  });
});

afterAll(() => {
  global.ResizeObserver = originalResizeObserver;
  jest.restoreAllMocks();
});

function Wrapper({ children }: PropsWithChildren) {
  return <BUIProvider>{children}</BUIProvider>;
}

const classes = {
  breadcrumbs: 'bui-PluginHeaderBreadcrumbs',
  breadcrumbsSeparator: 'bui-PluginHeaderBreadcrumbsSeparator',
};

describe('PluginHeaderBreadcrumbs', () => {
  it('should render a nav landmark with all breadcrumbs', () => {
    render(
      <PluginHeaderBreadcrumbs
        classes={classes}
        entries={[
          { href: '/', label: 'Home' },
          { href: '/profile', label: 'User Profile' },
          { href: '/profile/settings', label: 'Settings' },
        ]}
      />,
      { wrapper: Wrapper },
    );

    expect(screen.getByRole('navigation')).toHaveAttribute(
      'aria-label',
      'Breadcrumbs',
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should render links for non-current items and plain text for the last item', () => {
    render(
      <PluginHeaderBreadcrumbs
        classes={classes}
        entries={[
          { href: '/', label: 'Home' },
          { href: '/profile', label: 'User Profile' },
          { href: '/profile/settings', label: 'Settings' },
        ]}
      />,
      { wrapper: Wrapper },
    );

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent('Home');
    expect(links[0]).toHaveAttribute('href', '/');
    expect(links[1]).toHaveTextContent('User Profile');
    expect(links[1]).toHaveAttribute('href', '/profile');

    const currentItem = screen.getByText('Settings');
    expect(currentItem.tagName).toBe('SPAN');
    expect(currentItem.closest('li')).toHaveAttribute('data-current', 'true');
  });

  it('should render separators between items but not after the last one', () => {
    const { container } = render(
      <PluginHeaderBreadcrumbs
        classes={classes}
        entries={[
          { href: '/', label: 'Home' },
          { href: '/profile', label: 'User Profile' },
          { href: '/profile/settings', label: 'Settings' },
        ]}
      />,
      { wrapper: Wrapper },
    );

    const items = screen.getAllByRole('listitem');
    const separators = container.querySelectorAll(
      '.bui-PluginHeaderBreadcrumbsSeparator',
    );
    expect(separators).toHaveLength(items.length - 1);

    expect(
      items[0].querySelector('.bui-PluginHeaderBreadcrumbsSeparator'),
    ).not.toBeNull();
    expect(
      items[1].querySelector('.bui-PluginHeaderBreadcrumbsSeparator'),
    ).not.toBeNull();
    expect(
      items[2].querySelector('.bui-PluginHeaderBreadcrumbsSeparator'),
    ).toBeNull();
  });

  it('should render a single breadcrumb as current with no separators', () => {
    const { container } = render(
      <PluginHeaderBreadcrumbs
        classes={classes}
        entries={[{ href: '/', label: 'Only Page' }]}
      />,
      { wrapper: Wrapper },
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByText('Only Page').closest('li')).toHaveAttribute(
      'data-current',
      'true',
    );
    expect(
      container.querySelectorAll('.bui-PluginHeaderBreadcrumbsSeparator'),
    ).toHaveLength(0);
  });

  describe('collapsing', () => {
    it('should not collapse when there are 4 or fewer items', () => {
      render(
        <PluginHeaderBreadcrumbs
          classes={classes}
          entries={[
            { href: '/', label: 'Home' },
            { href: '/profile', label: 'User Profile' },
            { href: '/profile/settings', label: 'Settings' },
            { href: '/profile/settings/details', label: 'Details' },
          ]}
        />,
        { wrapper: Wrapper },
      );

      expect(screen.getAllByRole('listitem')).toHaveLength(4);
      expect(
        screen.queryByLabelText('Show more breadcrumbs'),
      ).not.toBeInTheDocument();
    });

    it('should collapse middle items into an ellipsis menu at 5+ items', async () => {
      const user = userEvent.setup();

      render(
        <PluginHeaderBreadcrumbs
          classes={classes}
          entries={[
            { href: '/', label: 'Home' },
            { href: '/docs', label: 'Docs' },
            { href: '/docs/guides', label: 'Guides' },
            { href: '/docs/guides/setup', label: 'Setup' },
            { href: '/docs/guides/setup/intro', label: 'Introduction' },
          ]}
        />,
        { wrapper: Wrapper },
      );

      // keep first & last-TWO breadcrumbs
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(
        screen.getByLabelText('Show more breadcrumbs'),
      ).toBeInTheDocument();
      expect(screen.getByText('Setup')).toBeInTheDocument();
      expect(screen.getByText('Introduction')).toBeInTheDocument();

      expect(screen.queryByText('Docs')).not.toBeInTheDocument();
      expect(screen.queryByText('Guides')).not.toBeInTheDocument();

      // rest are in menu
      await user.click(screen.getByLabelText('Show more breadcrumbs'));

      const menuItems = await screen.findAllByRole('menuitem');
      expect(menuItems).toHaveLength(2);
      expect(menuItems[0]).toHaveTextContent('Docs');
      expect(menuItems[1]).toHaveTextContent('Guides');
    });

    it('should keep the last item marked as current', () => {
      render(
        <PluginHeaderBreadcrumbs
          classes={classes}
          entries={[
            { href: '/', label: 'Home' },
            { href: '/docs', label: 'Docs' },
            { href: '/docs/guides', label: 'Guides' },
            { href: '/docs/guides/setup', label: 'Setup' },
            { href: '/docs/guides/setup/intro', label: 'Introduction' },
          ]}
        />,
        { wrapper: Wrapper },
      );

      expect(screen.getByText('Introduction').closest('li')).toHaveAttribute(
        'data-current',
        'true',
      );
    });

    it('should render a separator after the ellipsis', () => {
      render(
        <PluginHeaderBreadcrumbs
          classes={classes}
          entries={[
            { href: '/', label: 'Home' },
            { href: '/docs', label: 'Docs' },
            { href: '/docs/guides', label: 'Guides' },
            { href: '/docs/guides/setup', label: 'Setup' },
            { href: '/docs/guides/setup/intro', label: 'Introduction' },
          ]}
        />,
        { wrapper: Wrapper },
      );

      const ellipsisItem = screen
        .getByLabelText('Show more breadcrumbs')
        .closest('li')!;
      expect(
        ellipsisItem.querySelector('.bui-PluginHeaderBreadcrumbsSeparator'),
      ).not.toBeNull();
    });
  });
});
