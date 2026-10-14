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

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
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

describe('Header tabs overflow', () => {
  const originalResizeObserver = global.ResizeObserver;
  let resizeCallbacks: (() => void)[];
  let disconnect: jest.Mock;
  let width: number;
  let contentWidth: number;

  beforeEach(() => {
    resizeCallbacks = [];
    disconnect = jest.fn();
    width = 300;
    contentWidth = 900;
    Object.defineProperty(global, 'ResizeObserver', {
      configurable: true,
      value: jest.fn((callback: () => void) => {
        resizeCallbacks.push(callback);
        return { observe: jest.fn(), disconnect };
      }),
    });
    jest
      .spyOn(HTMLElement.prototype, 'clientWidth', 'get')
      .mockImplementation(() => width);
    jest
      .spyOn(HTMLElement.prototype, 'scrollWidth', 'get')
      .mockImplementation(() => contentWidth);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    Object.defineProperty(global, 'ResizeObserver', {
      configurable: true,
      value: originalResizeObserver,
    });
  });

  it('marks each overflowing side of the tab row and shows scroll buttons', () => {
    const { container, unmount } = renderHeader({
      tabs: [{ id: 'overview', label: 'Overview', href: 'overview' }],
    });
    const wrapper = screen.getByRole('navigation', {
      name: 'Content navigation',
    }).parentElement!;
    const scrollButton = (side: string) =>
      container.querySelector(`button[data-side="${side}"]`);

    expect(wrapper).toHaveAttribute('data-overflow-end');
    expect(wrapper).not.toHaveAttribute('data-overflow-start');
    expect(scrollButton('end')).toHaveAttribute('aria-hidden', 'true');
    expect(scrollButton('end')).toHaveAttribute('tabindex', '-1');
    expect(scrollButton('start')).toBeNull();

    wrapper.scrollLeft = 350;
    fireEvent.scroll(wrapper);
    expect(wrapper).toHaveAttribute('data-overflow-start');
    expect(wrapper).toHaveAttribute('data-overflow-end');
    expect(scrollButton('start')).not.toBeNull();

    wrapper.scrollLeft = 600;
    fireEvent.scroll(wrapper);
    expect(wrapper).not.toHaveAttribute('data-overflow-end');
    expect(scrollButton('end')).toBeNull();

    wrapper.scrollLeft = 0;
    fireEvent.scroll(wrapper);
    expect(wrapper).not.toHaveAttribute('data-overflow-start');
    expect(wrapper).toHaveAttribute('data-overflow-end');

    width = 1000;
    act(() => {
      for (const resize of resizeCallbacks) resize();
    });
    expect(wrapper).not.toHaveAttribute('data-overflow-end');
    expect(scrollButton('end')).toBeNull();

    unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it('scrolls the tab row from the buttons, respecting reduced motion', () => {
    const originalMatchMedia = window.matchMedia;
    const originalScrollBy = HTMLElement.prototype.scrollBy;
    const scrollBy = jest.fn();
    HTMLElement.prototype.scrollBy = scrollBy;
    let reduceMotion = false;
    window.matchMedia = () =>
      ({ matches: reduceMotion } as unknown as MediaQueryList);

    try {
      const { container } = renderHeader({
        tabs: [{ id: 'overview', label: 'Overview', href: 'overview' }],
      });
      const wrapper = screen.getByRole('navigation', {
        name: 'Content navigation',
      }).parentElement!;

      fireEvent.click(container.querySelector('button[data-side="end"]')!);
      expect(scrollBy).toHaveBeenLastCalledWith({
        left: 240,
        behavior: 'smooth',
      });

      wrapper.scrollLeft = 350;
      fireEvent.scroll(wrapper);
      reduceMotion = true;
      fireEvent.click(container.querySelector('button[data-side="start"]')!);
      expect(scrollBy).toHaveBeenLastCalledWith({
        left: -240,
        behavior: 'auto',
      });
    } finally {
      window.matchMedia = originalMatchMedia;
      HTMLElement.prototype.scrollBy = originalScrollBy;
    }
  });

  it('scrolls the active tab into view on load and when the route changes', async () => {
    const originalScrollBy = HTMLElement.prototype.scrollBy;
    const scrollBy = jest.fn();
    HTMLElement.prototype.scrollBy = scrollBy;
    jest
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function rect(this: HTMLElement) {
        const [left, right] =
          this.textContent === 'Docs' && this.tagName === 'A'
            ? [700, 800]
            : [0, 300];
        return { left, right } as DOMRect;
      });

    try {
      const tabs = [
        { id: 'overview', label: 'Overview', href: 'overview' },
        { id: 'docs', label: 'Docs', href: 'docs' },
      ];

      const { unmount } = renderHeader({ tabs }, '/app/catalog/entity/docs');
      expect(scrollBy).toHaveBeenCalledWith({ left: 532, behavior: 'auto' });
      unmount();
      scrollBy.mockClear();

      renderHeader(
        { tabs, description: '[Read the docs](docs)' },
        '/app/catalog/entity/overview',
      );
      expect(scrollBy).not.toHaveBeenCalled();

      fireEvent.click(screen.getByRole('link', { name: 'Read the docs' }));
      expect(screen.getByRole('status')).toHaveTextContent(
        '/catalog/entity/docs',
      );
      await waitFor(() =>
        expect(scrollBy).toHaveBeenCalledWith({
          left: 532,
          behavior: 'smooth',
        }),
      );
    } finally {
      HTMLElement.prototype.scrollBy = originalScrollBy;
    }
  });
});
