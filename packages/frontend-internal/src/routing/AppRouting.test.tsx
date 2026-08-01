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

import { PropsWithChildren, ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { act, renderHook } from '@testing-library/react';
import { appHistoryApiRef, useApiHolder } from '@backstage/frontend-plugin-api';
import { createMockAppHistory } from '@backstage/frontend-test-utils';
import { TestApiProvider } from '@backstage/test-utils';
import { PageMountProvider, type PageMount } from './PageMountContext';
import {
  normalizeBasePath,
  useAppGoBack,
  useAppHref,
  useAppLocation,
  useAppResolvedPath,
} from './AppRouting';

/** Chrome resolves the app history from the API holder; tests do it inline. */
function useOptionalAppHistory() {
  return useApiHolder().get(appHistoryApiRef);
}

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

type MockAppHistory = ReturnType<typeof createMockAppHistory>;

function frameworkWrapper(options: {
  location?: string;
  pageMount?: PageMount;
  appHistory?: MockAppHistory;
  basename?: string;
}) {
  const appHistory =
    options.appHistory ??
    createMockAppHistory({
      initialLocation: options.location ?? '/',
      basename: options.basename,
    });
  const { pageMount } = options;
  return ({ children }: PropsWithChildren<{}>) => (
    <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
      <MemoryRouter initialEntries={[options.location ?? '/']}>
        {pageMount ? (
          <PageMountProvider mount={pageMount}>{children}</PageMountProvider>
        ) : (
          children
        )}
      </MemoryRouter>
    </TestApiProvider>
  );
}

describe('normalizeBasePath', () => {
  it('strips trailing slashes and collapses the app root to an empty prefix', () => {
    expect(normalizeBasePath(undefined)).toBe('');
    expect(normalizeBasePath('/')).toBe('');
    expect(normalizeBasePath('///')).toBe('');
    expect(normalizeBasePath('/catalog')).toBe('/catalog');
    expect(normalizeBasePath('/catalog/')).toBe('/catalog');
  });
});

describe('useAppResolvedPath', () => {
  it('resolves relative targets against the page mount, not the location (framework)', () => {
    const resolve = (to: string, location: string, pageMount?: PageMount) =>
      renderHook(() => useAppResolvedPath(useOptionalAppHistory(), to), {
        wrapper: frameworkWrapper({ location, pageMount }),
      }).result.current.pathname;

    // App chrome renders outside the route tree, so there is no page mount and
    // relative targets resolve against the app root - the same answer React
    // Router gives when no route matched.
    expect(resolve('catalog', '/catalog')).toBe('/catalog');
    expect(resolve('catalog', '/catalog/default/component/foo')).toBe(
      '/catalog',
    );
    expect(resolve('', '/catalog/default/component/foo')).toBe('/');

    const pageMount: PageMount = {
      basePath: '/catalog/default/component/foo',
      routePattern: '/catalog/:namespace/:kind/:name',
    };
    expect(
      resolve('widgets', '/catalog/default/component/foo/docs', pageMount),
    ).toBe('/catalog/default/component/foo/widgets');
  });

  it('keeps absolute targets and their search string intact (framework)', () => {
    const { result } = renderHook(
      () =>
        useAppResolvedPath(useOptionalAppHistory(), '/catalog?kind=component'),
      { wrapper: frameworkWrapper({ location: '/docs' }) },
    );

    expect(result.current).toMatchObject({
      pathname: '/catalog',
      search: '?kind=component',
    });
  });

  it('defers to React Router route matching when there is no app history', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={['/catalog/default/component/foo']}>
        <Routes>
          <Route path="/catalog/*" element={children} />
        </Routes>
      </MemoryRouter>
    );

    const { result } = renderHook(
      () => useAppResolvedPath(useOptionalAppHistory(), 'widgets'),
      {
        wrapper,
      },
    );
    const { result: emptyResult } = renderHook(
      () => useAppResolvedPath(useOptionalAppHistory(), ''),
      {
        wrapper,
      },
    );

    expect(result.current.pathname).toBe('/catalog/widgets');
    expect(emptyResult.current.pathname).toBe('/catalog');
  });
});

describe('useAppLocation', () => {
  it('reports the app history location, including its search string', () => {
    const appHistory = createMockAppHistory({
      initialLocation: '/catalog?kind=component',
    });

    const { result } = renderHook(
      () => useAppLocation(useOptionalAppHistory()),
      {
        wrapper: frameworkWrapper({ location: '/from-router', appHistory }),
      },
    );

    // The framework wins over the ambient router, and `search` survives.
    expect(result.current).toMatchObject({
      pathname: '/catalog',
      search: '?kind=component',
    });

    act(() => {
      appHistory.navigate('/docs?tab=readme');
    });

    expect(result.current).toMatchObject({
      pathname: '/docs',
      search: '?tab=readme',
    });
  });

  it('falls back to React Router when there is no app history', () => {
    const { result } = renderHook(
      () => useAppLocation(useOptionalAppHistory()),
      {
        wrapper: ({ children }: PropsWithChildren<{}>) => (
          <MemoryRouter initialEntries={['/explore?filter=all']}>
            {children}
          </MemoryRouter>
        ),
      },
    );

    expect(result.current).toMatchObject({
      pathname: '/explore',
      search: '?filter=all',
    });
  });
});

describe('useAppHref', () => {
  it('applies the app deploy basename through the app history', () => {
    const { result } = renderHook(
      () => useAppHref(useOptionalAppHistory(), '/catalog'),
      {
        wrapper: frameworkWrapper({ basename: '/backstage' }),
      },
    );

    expect(result.current).toBe('/backstage/catalog');
  });

  it('falls back to React Router when there is no app history', () => {
    const { result } = renderHook(
      () => useAppHref(useOptionalAppHistory(), '/catalog'),
      {
        wrapper: ({ children }: PropsWithChildren<{}>) => (
          <MemoryRouter basename="/backstage" initialEntries={['/backstage']}>
            {children}
          </MemoryRouter>
        ),
      },
    );

    expect(result.current).toBe('/backstage/catalog');
  });

  it('leaves targets that are not app-relative unchanged on both authorities', () => {
    const framework = (to: string) =>
      renderHook(() => useAppHref(useOptionalAppHistory(), to), {
        wrapper: frameworkWrapper({ basename: '/backstage' }),
      }).result.current;

    const legacy = (to: string) =>
      renderHook(() => useAppHref(useOptionalAppHistory(), to), {
        wrapper: ({ children }: PropsWithChildren<{}>) => (
          <MemoryRouter basename="/backstage" initialEntries={['/backstage']}>
            {children}
          </MemoryRouter>
        ),
      }).result.current;

    for (const to of [
      'https://example.com/x',
      '//example.com/x',
      'mailto:someone@example.com',
      'tel:+15555550123',
    ]) {
      expect(framework(to)).toBe(to);
      expect(legacy(to)).toBe(to);
    }

    // A URL carried in the query string is still an app-relative target, so
    // the deploy basename is applied on both paths.
    expect(framework('/search?query=https://example.com')).toBe(
      '/backstage/search?query=https://example.com',
    );
    expect(legacy('/search?query=https://example.com')).toBe(
      '/backstage/search?query=https://example.com',
    );
  });
});

describe('useAppGoBack', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('goes back through the browser on the framework path', () => {
    const historyBack = jest.spyOn(window.history, 'back').mockReturnValue();

    const { result } = renderHook(() => useAppGoBack(useOptionalAppHistory()), {
      wrapper: frameworkWrapper({}),
    });
    act(() => {
      result.current();
    });

    expect(historyBack).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();

    historyBack.mockRestore();
  });

  it('uses React Router navigate(-1) when there is no app history', () => {
    const { result } = renderHook(() => useAppGoBack(useOptionalAppHistory()), {
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <MemoryRouter>{children}</MemoryRouter>
      ),
    });
    act(() => {
      result.current();
    });

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
