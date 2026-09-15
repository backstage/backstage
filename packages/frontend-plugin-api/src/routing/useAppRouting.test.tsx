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
  renderHook,
  screen,
} from '@testing-library/react';
import { TestApiProvider } from '@backstage/test-utils';
import { createMockAppHistory } from '@backstage/frontend-test-utils';
import { PageMountProvider } from '@internal/frontend';
import { appHistoryApiRef } from './AppHistoryApi';
import { useAppRouting } from './useAppRouting';
import { Link, RouterProvider } from 'react-aria-components';

describe('useAppRouting', () => {
  it('keeps direct React Aria hrefs and clicks in the provider scope across a deeper mount', () => {
    const history = createMockAppHistory({
      basename: '/app',
      initialLocation: '/app/catalog/entity',
    });
    function Content() {
      const routing = useAppRouting();
      return (
        <RouterProvider
          navigate={routing.navigate}
          useHref={routing.createHref}
        >
          <PageMountProvider
            mount={{
              basePath: '/catalog/entity',
              routePattern: '/catalog/:name',
            }}
          >
            <Link href="details?view=docs#intro">Details</Link>
          </PageMountProvider>
        </RouterProvider>
      );
    }
    render(
      <TestApiProvider apis={[[appHistoryApiRef, history]]}>
        <PageMountProvider
          mount={{ basePath: '/catalog', routePattern: '/catalog' }}
        >
          <Content />
        </PageMountProvider>
      </TestApiProvider>,
    );
    const link = screen.getByRole('link', { name: 'Details' });
    expect(link).toHaveAttribute(
      'href',
      '/app/catalog/details?view=docs#intro',
    );
    fireEvent.click(link);
    expect(history.location).toMatchObject({
      pathname: '/catalog/details',
      search: '?view=docs',
      hash: '#intro',
      state: undefined,
    });
  });

  it('binds hrefs and navigation to the same page ancestry and tracks location changes', () => {
    const history = createMockAppHistory({
      basename: '/app',
      initialLocation: '/app/catalog/entity/docs',
    });
    const { result } = renderHook(() => useAppRouting(), {
      wrapper: ({ children }) => (
        <TestApiProvider apis={[[appHistoryApiRef, history]]}>
          <PageMountProvider
            mount={{ basePath: '/catalog', routePattern: '/catalog' }}
          >
            <PageMountProvider
              mount={{
                basePath: '/catalog/entity',
                routePattern: '/catalog/:name',
              }}
            >
              {children}
            </PageMountProvider>
          </PageMountProvider>
        </TestApiProvider>
      ),
    });
    expect(result.current.createHref('../create?view=docs#intro')).toBe(
      '/app/catalog/create?view=docs#intro',
    );
    expect(result.current.createHref('?view=docs')).toBe(
      '/app/catalog/entity/docs?view=docs',
    );
    expect(result.current.createHref('https://example.com/docs')).toBe(
      'https://example.com/docs',
    );
    act(() =>
      result.current.navigate('../create?view=docs#intro', {
        replace: true,
        state: { source: 'aria' },
      }),
    );
    expect(history.location).toMatchObject({
      pathname: '/catalog/create',
      search: '?view=docs',
      hash: '#intro',
      state: { source: 'aria' },
    });
    expect(result.current.location).toEqual(history.location);
  });

  it('keeps browser destinations out of app history and sanitizes executable hrefs', () => {
    const history = createMockAppHistory();
    const { result } = renderHook(() => useAppRouting(), {
      wrapper: ({ children }) => (
        <TestApiProvider apis={[[appHistoryApiRef, history]]}>
          {children}
        </TestApiProvider>
      ),
    });
    const warning = jest.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      expect(result.current.createHref('java\tscript:alert(1)')).toBe(
        'about:blank',
      );
      expect(warning).toHaveBeenCalledTimes(1);
      const before = history.location;
      result.current.navigate(`${window.location.origin}/#native-aria`);
      expect(window.location.hash).toBe('#native-aria');
      expect(history.location).toEqual(before);
    } finally {
      warning.mockRestore();
      window.history.replaceState(null, '', '/');
    }
  });
});
