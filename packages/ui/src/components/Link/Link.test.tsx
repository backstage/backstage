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
  createVersionedValueMap,
  type VersionedValue,
} from '@backstage/version-bridge';
import { fireEvent, render, screen } from '@testing-library/react';
import { createRef, useMemo, type PropsWithChildren } from 'react';
import * as ProviderReactAria from 'react-aria';
import { RouterProvider } from 'react-aria-components';
import {
  MemoryRouter,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useNavigationType,
  type NavigateOptions,
} from 'react-router-dom';
import { BUIContext, type BUIContextVersions } from '../../provider/BUIContext';
import { BUIProvider } from '../../provider/BUIProvider';
import { useResolvedHref } from '../../hooks/useResolvedHref';
import { Link } from './Link';

const routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

function LocationStatus() {
  const location = useLocation();
  const navigationType = useNavigationType();
  return (
    <span role="status">
      {location.pathname}
      {location.search}
      {location.hash}:{navigationType}:{location.state?.source}
    </span>
  );
}

function HistoryBackButton() {
  const navigate = useNavigate();
  return <button onClick={() => navigate(-1)}>Back</button>;
}

function OldBUIProvider({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const value = useMemo(
    () =>
      createVersionedValueMap({
        1: { useAnalytics: undefined },
      }) as VersionedValue<BUIContextVersions>,
    [],
  );

  return (
    <RouterProvider navigate={navigate} useHref={useResolvedHref}>
      <BUIContext.Provider value={value}>{children}</BUIContext.Provider>
    </RouterProvider>
  );
}

function createRouterWrapper({
  entry = '/app/catalog/entity/docs',
  provider = 'new',
}: {
  entry?: string;
  provider?: 'new' | 'old';
} = {}) {
  return function RouterWrapper({ children }: PropsWithChildren) {
    const content = (
      <>
        <Routes>
          <Route path="catalog" element={<Outlet />}>
            <Route path="entity" element={<Outlet />}>
              <Route path="docs/*" element={children} />
            </Route>
          </Route>
          <Route path="*" element={null} />
        </Routes>
        <LocationStatus />
      </>
    );

    return (
      <MemoryRouter
        basename="/app"
        initialEntries={[entry]}
        future={routerFuture}
      >
        {provider === 'new' ? (
          <BUIProvider>{content}</BUIProvider>
        ) : (
          <OldBUIProvider>{content}</OldBUIProvider>
        )}
      </MemoryRouter>
    );
  };
}

describe('Link', () => {
  it.each(['new', 'old'] as const)(
    'navigates client-side under the %s provider and applies the basename once',
    provider => {
      render(<Link href="/catalog/overview">Overview</Link>, {
        wrapper: createRouterWrapper({ provider }),
      });

      const link = screen.getByRole('link', { name: 'Overview' });
      expect(link).toHaveAttribute('href', '/app/catalog/overview');
      fireEvent.click(link);
      expect(screen.getByRole('status')).toHaveTextContent('/catalog/overview');
    },
  );

  it.each([
    ['child', '/catalog/entity/docs/child'],
    ['.', '/catalog/entity/docs'],
    ['..', '/catalog/entity'],
    ['?tab=docs', '/catalog/entity/docs?tab=docs'],
    ['#api', '/catalog/entity/docs#api'],
  ])('preserves relative destination %s', (href, expectedLocation) => {
    render(<Link href={href}>Destination</Link>, {
      wrapper: createRouterWrapper(),
    });

    fireEvent.click(screen.getByRole('link', { name: 'Destination' }));
    expect(screen.getByRole('status')).toHaveTextContent(expectedLocation);
  });

  it('renders a native relative anchor outside React Router', () => {
    render(<Link href="../entity?tab=docs#api">Destination</Link>);

    expect(screen.getByRole('link', { name: 'Destination' })).toHaveAttribute(
      'href',
      '../entity?tab=docs#api',
    );
  });

  it('preserves refs and accessibility properties', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Link
        ref={ref}
        href="/catalog/overview"
        aria-label="Catalog overview"
        aria-current="page"
      >
        Overview
      </Link>,
      { wrapper: createRouterWrapper() },
    );

    const link = screen.getByRole('link', { name: 'Catalog overview' });
    expect(ref.current).toBe(link);
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveAttribute('data-variant', 'body-medium');
    expect(link).toHaveAttribute('data-weight', 'regular');
    expect(link).toHaveAttribute('data-color', 'primary');
  });

  it('reports the caller raw href to analytics', () => {
    const captureEvent = jest.fn();
    const wrapper = ({ children }: PropsWithChildren) => (
      <MemoryRouter
        basename="/app"
        initialEntries={['/app/catalog/entity/docs']}
        future={routerFuture}
      >
        <BUIProvider useAnalytics={() => ({ captureEvent })}>
          <Routes>
            <Route path="catalog/entity/docs/*" element={children} />
          </Routes>
        </BUIProvider>
      </MemoryRouter>
    );
    render(<Link href="child">Child</Link>, { wrapper });

    fireEvent.click(screen.getByRole('link', { name: 'Child' }));
    expect(captureEvent).toHaveBeenCalledWith('click', 'Child', {
      attributes: { to: 'child' },
    });
  });

  it('does not consume modifier clicks', () => {
    render(<Link href="child">Child</Link>, {
      wrapper: createRouterWrapper(),
    });
    const link = screen.getByRole('link', { name: 'Child' });

    fireEvent.click(link, { metaKey: true });
    expect(screen.getByRole('status')).toHaveTextContent(
      '/catalog/entity/docs',
    );
    fireEvent.click(link, { ctrlKey: true });
    expect(screen.getByRole('status')).toHaveTextContent(
      '/catalog/entity/docs',
    );
    fireEvent.click(link, { shiftKey: true });
    expect(screen.getByRole('status')).toHaveTextContent(
      '/catalog/entity/docs',
    );
    fireEvent.click(link, { altKey: true });
    expect(screen.getByRole('status')).toHaveTextContent(
      '/catalog/entity/docs',
    );
  });

  it.each([
    ['_blank', '_blank'],
    ['preview', 'preview'],
    ['_parent', '_parent'],
    ['_top', '_top'],
  ])('leaves target %s navigation to the browser', (_name, target) => {
    render(
      <Link href="/catalog/overview" target={target}>
        Overview
      </Link>,
      { wrapper: createRouterWrapper() },
    );

    const link = screen.getByRole('link', { name: 'Overview' });
    expect(link).toHaveAttribute('href', '/app/catalog/overview');
    expect(link).toHaveAttribute('target', target);
  });

  it('keeps _self navigation client-side', () => {
    render(
      <Link href="/catalog/overview" target="_self">
        Overview
      </Link>,
      { wrapper: createRouterWrapper() },
    );

    fireEvent.click(screen.getByRole('link', { name: 'Overview' }));
    expect(screen.getByRole('status')).toHaveTextContent('/catalog/overview');
  });

  it.each([
    ['https://example.test/docs', undefined],
    ['mailto:owner@example.test', undefined],
    ['tel:+123456789', undefined],
    ['sms:+123456789', undefined],
    ['ftp://example.test/file', undefined],
    ['vscode://file/workspace', undefined],
    ['//cdn.example.test/file', undefined],
    ['/catalog/export', true],
    ['/catalog/export', 'catalog.yaml'],
  ])('preserves browser-owned href %s and download %s', (href, download) => {
    render(
      <Link href={href} download={download}>
        Destination
      </Link>,
      { wrapper: createRouterWrapper() },
    );

    const link = screen.getByRole('link', { name: 'Destination' });
    expect(link).toHaveAttribute(
      'href',
      href.startsWith('/') && !href.startsWith('//') ? `/app${href}` : href,
    );
    if (download !== undefined) {
      expect(link).toHaveAttribute(
        'download',
        download === true ? '' : download,
      );
    }
  });

  it.each(['new', 'old'] as const)(
    'navigates with the actual Link from an isolated BUI graph under the %s provider',
    provider => {
      const sharedReact = jest.requireActual<typeof import('react')>('react');
      const sharedReactDom =
        jest.requireActual<typeof import('react-dom')>('react-dom');
      const sharedReactDomClient =
        jest.requireActual<typeof import('react-dom/client')>(
          'react-dom/client',
        );
      const sharedReactRouter =
        jest.requireActual<typeof import('react-router')>('react-router');
      const sharedReactRouterDom =
        jest.requireActual<typeof import('react-router-dom')>(
          'react-router-dom',
        );
      let IsolatedLink!: typeof Link;
      let IsolatedReactAria!: typeof ProviderReactAria;

      jest.isolateModules(() => {
        jest.doMock('react', () => sharedReact);
        jest.doMock('react-dom', () => sharedReactDom);
        jest.doMock('react-dom/client', () => sharedReactDomClient);
        jest.doMock('react-router', () => sharedReactRouter);
        jest.doMock('react-router-dom', () => sharedReactRouterDom);
        IsolatedReactAria = jest.requireActual('react-aria');
        ({ Link: IsolatedLink } = jest.requireActual('./Link'));
      });

      expect(IsolatedReactAria).not.toBe(ProviderReactAria);
      render(
        <IsolatedLink
          href="child"
          routerOptions={{
            replace: true,
            state: { source: `isolated-${provider}` },
          }}
        >
          Isolated child
        </IsolatedLink>,
        { wrapper: createRouterWrapper({ provider }) },
      );

      fireEvent.click(screen.getByRole('link', { name: 'Isolated child' }));
      expect(screen.getByRole('status')).toHaveTextContent(
        `/catalog/entity/docs/child:REPLACE:isolated-${provider}`,
      );
    },
  );

  it('navigates once when React Aria delegates flushSync navigation', () => {
    render(
      <MemoryRouter initialEntries={['/source']} future={routerFuture}>
        <BUIProvider>
          <Routes>
            <Route
              path="source"
              element={
                <Link
                  href="/destination"
                  routerOptions={{
                    flushSync: true,
                    state: { source: 'shared-react-aria' },
                  }}
                >
                  Destination
                </Link>
              }
            />
            <Route path="destination" element={<LocationStatus />} />
          </Routes>
          <HistoryBackButton />
        </BUIProvider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Destination' }));
    expect(screen.getByRole('status')).toHaveTextContent(
      '/destination:PUSH:shared-react-aria',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(
      screen.getByRole('link', { name: 'Destination' }),
    ).toBeInTheDocument();
  });

  it('passes complete router options once from an isolated BUI graph under a V1 provider', () => {
    const sharedReact = jest.requireActual<typeof import('react')>('react');
    const sharedReactDom =
      jest.requireActual<typeof import('react-dom')>('react-dom');
    const sharedReactDomClient =
      jest.requireActual<typeof import('react-dom/client')>('react-dom/client');
    const sharedReactRouter =
      jest.requireActual<typeof import('react-router')>('react-router');
    const sharedReactRouterDom =
      jest.requireActual<typeof import('react-router-dom')>('react-router-dom');
    const navigationCalls: Array<[string, NavigateOptions | undefined]> = [];
    let hostNavigate: ReturnType<typeof useNavigate> | undefined;
    const trackedNavigate = ((to: string, options?: NavigateOptions) => {
      navigationCalls.push([to, options]);
      hostNavigate?.(to, options);
    }) as ReturnType<typeof useNavigate>;
    let IsolatedLink!: typeof Link;

    jest.isolateModules(() => {
      jest.doMock('react', () => sharedReact);
      jest.doMock('react-dom', () => sharedReactDom);
      jest.doMock('react-dom/client', () => sharedReactDomClient);
      jest.doMock('react-router', () => sharedReactRouter);
      jest.doMock('react-router-dom', () => ({
        ...sharedReactRouterDom,
        useNavigate: () => trackedNavigate,
      }));
      ({ Link: IsolatedLink } = jest.requireActual('./Link'));
    });

    const routerOptions = {
      flushSync: true,
      preventScrollReset: true,
      relative: 'route' as const,
      replace: false,
      state: { source: 'isolated-v1' },
      viewTransition: true,
    };
    const CaptureHostNavigate = ({ children }: PropsWithChildren) => {
      hostNavigate = useNavigate();
      return children;
    };

    render(
      <MemoryRouter initialEntries={['/source']} future={routerFuture}>
        <CaptureHostNavigate>
          <OldBUIProvider>
            <Routes>
              <Route
                path="source"
                element={
                  <IsolatedLink
                    href="/destination"
                    routerOptions={routerOptions}
                  >
                    Isolated destination
                  </IsolatedLink>
                }
              />
              <Route path="destination" element={<LocationStatus />} />
            </Routes>
            <HistoryBackButton />
          </OldBUIProvider>
        </CaptureHostNavigate>
      </MemoryRouter>,
    );

    const link = screen.getByRole('link', { name: 'Isolated destination' });
    fireEvent.click(link, { metaKey: true });
    expect(navigationCalls).toHaveLength(0);
    expect(link).toBeInTheDocument();

    fireEvent.click(link);
    expect(navigationCalls).toEqual([['/destination', routerOptions]]);
    expect(screen.getByRole('status')).toHaveTextContent(
      '/destination:PUSH:isolated-v1',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(
      screen.getByRole('link', { name: 'Isolated destination' }),
    ).toBeInTheDocument();
  });
});
