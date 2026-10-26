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
import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import {
  useCallback,
  useMemo,
  type ComponentType,
  type PropsWithChildren,
} from 'react';
import * as ProviderReactAria from 'react-aria';
import {
  Link as ProviderAriaLink,
  RouterProvider,
  type ListBoxItemProps,
} from 'react-aria-components';
import {
  Link as RouterLink,
  MemoryRouter,
  Outlet,
  Route,
  Routes,
  useHref,
  useInRouterContext,
  useLocation,
  useNavigate,
  useNavigationType,
  useResolvedPath,
  type NavigateOptions,
} from 'react-router-dom';
import { BUIProvider } from '../provider/BUIProvider';
import { BUIContext, type BUIContextVersions } from '../provider/BUIContext';
import { useResolvedHref } from '../hooks/useResolvedHref';
import { isExternalLink } from '../utils/linkUtils';
import {
  getReactAriaAnchorProps,
  isBrowserOwnedHref,
  isNativeNavigation,
  useAnchorNavigation,
} from './useNavigation';
import {
  fallbackRoutingIntegration,
  useRoutingIntegration,
} from './useRouting';
import type { BUIRoutingIntegration } from './types';

const routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
} as const;

describe('navigation classification', () => {
  it.each([
    ['child', false],
    ['./child', false],
    ['../entity?tab=docs#api', false],
    ['/catalog', false],
    ['?tab=docs', false],
    ['#api', false],
    ['http://example.test', true],
    ['https://example.test', true],
    ['mailto:owner@example.test', true],
    ['tel:+123456789', true],
    ['sms:+123456789', true],
    ['ftp://example.test/file', true],
    ['HtTpS://example.test', true],
    ['vscode://file/workspace', true],
    ['APP+EXT.1:value', true],
    ['//cdn.example.test/file', true],
  ])('classifies %s as browser-owned: %s', (href, expected) => {
    expect(isBrowserOwnedHref(href)).toBe(expected);
    expect(isExternalLink(href)).toBe(expected);
  });

  it.each([
    [{ href: '/entity' }, false],
    [{ href: '/entity', target: '_self' }, false],
    [{ href: '/entity', target: '_blank' }, true],
    [{ href: '/entity', target: 'preview' }, true],
    [{ href: '/entity', target: '_parent' }, true],
    [{ href: '/entity', target: '_top' }, true],
    [{ href: '/entity', download: true }, true],
    [{ href: '/entity', download: 'entity.yaml' }, true],
    [{ href: 'mailto:owner@example.test' }, true],
  ])('classifies native navigation %# as %s', (props, expected) => {
    expect(isNativeNavigation(props)).toBe(expected);
  });
});

describe('useAnchorNavigation', () => {
  it.each([
    ['child', '/app/catalog/entity/docs'],
    ['', '/app/catalog/entity/docs'],
    ['.', '/app/catalog/entity/docs'],
    ['..', '/app/catalog/entity/docs'],
    ['?tab=docs', '/app/catalog/entity/docs'],
    ['#api', '/app/catalog/entity/docs'],
    ['child', '/app/catalog/entity/docs/reference/api'],
  ])('keeps the raw V2 destination %s from %s', (href, entry) => {
    const { result } = renderHook(() => useAnchorNavigation({ href }), {
      wrapper: createRouterWrapper({ entry, provider: 'new' }),
    });

    expect(result.current).toMatchObject({
      type: 'router',
      canMatchRoute: true,
      ariaHref: href,
      to: href,
      Link: RouterLink,
    });
    expect(result.current).toHaveProperty('routerOptions');
  });

  it.each([
    ['child', '/app/catalog/entity/docs', '/catalog/entity/docs/child'],
    ['', '/app/catalog/entity/docs', '/catalog/entity/docs'],
    ['.', '/app/catalog/entity/docs', '/catalog/entity/docs'],
    ['..', '/app/catalog/entity/docs', '/catalog/entity'],
    ['?tab=docs', '/app/catalog/entity/docs', '/catalog/entity/docs?tab=docs'],
    ['#api', '/app/catalog/entity/docs', '/catalog/entity/docs#api'],
    [
      'child',
      '/app/catalog/entity/docs/reference/api',
      '/catalog/entity/docs/reference/api/child',
    ],
  ])(
    'resolves only the old-provider aria href for %s from %s',
    (href, entry, expectedAriaHref) => {
      const { result } = renderHook(() => useAnchorNavigation({ href }), {
        wrapper: createRouterWrapper({ entry, provider: 'old' }),
      });

      expect(result.current).toEqual({
        type: 'router',
        canMatchRoute: true,
        ariaHref: expectedAriaHref,
        to: href,
        Link: RouterLink,
        routerOptions: undefined,
        routerLinkOptions: undefined,
        navigateWithFullOptions: undefined,
      });
    },
  );

  it('uses path-relative resolution for the old-provider aria href', () => {
    const { result } = renderHook(
      () =>
        useAnchorNavigation({
          href: '..',
          routerOptions: { relative: 'path' },
        }),
      {
        wrapper: createRouterWrapper({
          entry: '/app/catalog/entity/docs/reference/api',
          provider: 'old',
        }),
      },
    );

    expect(result.current).toMatchObject({
      type: 'router',
      ariaHref: '/catalog/entity/docs/reference',
      to: '..',
      routerOptions: { relative: 'path' },
    });
  });

  it.each(['new', 'old'] as const)(
    'uses path-relative hrefs for internal native destinations under the %s provider',
    provider => {
      const nativeOptions = [{ target: '_blank' as const }, { download: true }];

      for (const nativeOption of nativeOptions) {
        const { result, unmount } = renderHook(
          () =>
            useAnchorNavigation({
              href: '..',
              routerOptions: { relative: 'path' },
              ...nativeOption,
            }),
          {
            wrapper: createRouterWrapper({
              entry: '/app/catalog/entity/docs/reference/api',
              provider,
            }),
          },
        );

        expect(result.current).toMatchObject({
          type: 'native',
          ariaHref: '..',
          browserHref: '/app/catalog/entity/docs/reference',
        });
        unmount();
      }
    },
  );

  it.each(['new', 'old'] as const)(
    'applies the basename once to internal native destinations under the %s provider',
    provider => {
      const { result } = renderHook(
        () => useAnchorNavigation({ href: '/entity', target: '_blank' }),
        {
          wrapper: createRouterWrapper({
            entry: '/app/catalog/entity/docs',
            provider,
          }),
        },
      );

      expect(result.current).toEqual({
        type: 'native',
        canMatchRoute: true,
        ariaHref: '/entity',
        browserHref: '/app/entity',
      });
      expect(result.current).not.toHaveProperty(
        'browserHref',
        '/app/app/entity',
      );
    },
  );

  it.each(['new', 'old'] as const)(
    'keeps browser-owned destinations raw under the %s provider',
    provider => {
      const href = 'APP+EXT.1:value';
      const { result } = renderHook(
        () => useAnchorNavigation({ href, download: 'resource' }),
        {
          wrapper: createRouterWrapper({
            entry: '/app/catalog/entity/docs',
            provider,
          }),
        },
      );

      expect(result.current).toEqual({
        type: 'native',
        canMatchRoute: false,
        ariaHref: href,
        browserHref: href,
      });
    },
  );

  it('memoizes delegated options by its routing inputs', () => {
    const routerOptions = { replace: true };
    const { result, rerender } = renderHook(
      ({ href, options }: { href: string; options: NavigateOptions }) =>
        useAnchorNavigation({ href, routerOptions: options }),
      {
        initialProps: { href: 'child', options: routerOptions },
        wrapper: createRouterWrapper({
          entry: '/app/catalog/entity/docs',
          provider: 'new',
        }),
      },
    );
    const firstOptions =
      result.current.type === 'router'
        ? result.current.routerOptions
        : undefined;

    rerender({ href: 'child', options: routerOptions });
    const unchangedOptions =
      result.current.type === 'router'
        ? result.current.routerOptions
        : undefined;
    expect(unchangedOptions).toBe(firstOptions);

    const replacementRouterOptions = { replace: true };
    rerender({ href: 'child', options: replacementRouterOptions });
    const replacedOptions =
      result.current.type === 'router'
        ? result.current.routerOptions
        : undefined;
    expect(replacedOptions).not.toBe(firstOptions);

    rerender({ href: 'other', options: replacementRouterOptions });
    expect(
      result.current.type === 'router'
        ? result.current.routerOptions
        : undefined,
    ).not.toBe(replacedOptions);
  });

  it('selects native href behavior outside React Router', () => {
    const { result } = renderHook(() => useRoutingIntegration());
    expect(result.current).toBeUndefined();

    render(<OutsideRouterAnchor href="../entity?tab=docs#api" />);
    expect(screen.getByRole('link', { name: 'Destination' })).toHaveAttribute(
      'href',
      '../entity?tab=docs#api',
    );
  });

  it('opts into the fallback routing integration', () => {
    const { result } = renderHook(() =>
      useRoutingIntegration({ fallback: true }),
    );

    expect(result.current).toBe(fallbackRoutingIntegration);
  });
});

describe('getReactAriaAnchorProps', () => {
  it('does not pass a caller render when navigation is absent', () => {
    const routerOptions = { replace: true };
    const render: NonNullable<ListBoxItemProps<object>['render']> = () => (
      <div />
    );
    const props = { href: '/caller', routerOptions, render };

    const result = getReactAriaAnchorProps(
      { type: 'none', canMatchRoute: false },
      props,
    );

    expect(result).toEqual({
      href: '/caller',
      routerOptions,
      render: undefined,
    });
  });

  it('uses React Router with its supported options and no generated DOM href', () => {
    const routerOptions = {
      replace: true,
      state: { source: 'navigation-test' },
      preventScrollReset: true,
      relative: 'path' as const,
      flushSync: true,
      viewTransition: true,
    };
    const navigation = {
      type: 'router' as const,
      canMatchRoute: true,
      ariaHref: '/aria-destination',
      to: 'raw-destination',
      Link: RouterLink,
      routerOptions,
      routerLinkOptions: {
        replace: true,
        state: { source: 'navigation-test' },
        preventScrollReset: true,
        relative: 'path' as const,
        viewTransition: true,
      },
    };

    const result = getReactAriaAnchorProps(navigation, {
      href: '/caller',
      routerOptions: { preventScrollReset: true },
    });
    const rendered = result.render?.(
      { href: '/generated-destination', className: 'anchor' },
      {},
    );

    expect(result.href).toBe('/aria-destination');
    expect(result.routerOptions).toBe(routerOptions);
    expect(rendered).toEqual(
      <RouterLink
        className="anchor"
        preventScrollReset
        relative="path"
        replace
        state={{ source: 'navigation-test' }}
        to="raw-destination"
        viewTransition
      />,
    );
  });

  it('uses a BUI-owned anchor for native browser hrefs', () => {
    const consumerRender = jest.fn(() => <a href="/consumer" />);
    const props = {
      href: '/caller',
      render: consumerRender,
    } as Parameters<typeof getReactAriaAnchorProps>[1] & {
      render: typeof consumerRender;
    };
    const result = getReactAriaAnchorProps(
      {
        type: 'native',
        canMatchRoute: true,
        ariaHref: '/aria-destination',
        browserHref: '/browser-destination',
      },
      props,
    );

    const rendered = result.render?.(
      { href: '/generated-destination', className: 'anchor' },
      {},
    );

    expect(result.href).toBe('/aria-destination');
    expect(consumerRender).not.toHaveBeenCalled();
    expect(rendered).toEqual(
      <a className="anchor" href="/browser-destination" />,
    );
  });
});

describe('isolated React Aria compatibility', () => {
  it('uses full router options once across an isolated React Aria graph', () => {
    const sharedReact = jest.requireActual<typeof import('react')>('react');
    const sharedReactDom =
      jest.requireActual<typeof import('react-dom')>('react-dom');
    const sharedReactDomClient =
      jest.requireActual<typeof import('react-dom/client')>('react-dom/client');
    const sharedReactRouter =
      jest.requireActual<typeof import('react-router')>('react-router');
    const sharedReactRouterDom =
      jest.requireActual<typeof import('react-router-dom')>('react-router-dom');
    let IsolatedProbeAnchor!: ComponentType<{ href: string }>;
    let IsolatedAriaLink!: typeof ProviderAriaLink;
    let IsolatedReactAria!: typeof ProviderReactAria;
    let IsolatedRouterDom!: typeof sharedReactRouterDom;
    const navigationCalls: Array<[string, NavigateOptions | undefined]> = [];
    const routerOptions = {
      flushSync: true,
      preventScrollReset: true,
      relative: 'route' as const,
      replace: false,
      state: { source: 'isolated-react-aria' },
      viewTransition: true,
    };

    jest.isolateModules(() => {
      jest.doMock('react', () => sharedReact);
      jest.doMock('react-dom', () => sharedReactDom);
      jest.doMock('react-dom/client', () => sharedReactDomClient);
      jest.doMock('react-router', () => sharedReactRouter);
      jest.doMock('react-router-dom', () => sharedReactRouterDom);
      IsolatedRouterDom = jest.requireMock('react-router-dom');
      IsolatedReactAria = jest.requireActual('react-aria');
      ({ Link: IsolatedAriaLink } = jest.requireActual(
        'react-aria-components',
      ));
      const {
        getReactAriaAnchorProps: getIsolatedReactAriaAnchorProps,
        useAnchorNavigation: useIsolatedAnchorNavigation,
      } =
        jest.requireActual<typeof import('./useNavigation')>('./useNavigation');
      IsolatedProbeAnchor = ({ href }) => {
        const navigation = useIsolatedAnchorNavigation({
          href,
          routerOptions,
        });
        if (navigation.type !== 'router') {
          throw new Error('Expected router link');
        }
        const navigationProps = getIsolatedReactAriaAnchorProps(navigation, {
          href,
        });
        return (
          <IsolatedAriaLink {...navigationProps}>Destination</IsolatedAriaLink>
        );
      };
    });

    expect(IsolatedReactAria).not.toBe(ProviderReactAria);
    expect(IsolatedAriaLink).not.toBe(ProviderAriaLink);
    expect(IsolatedRouterDom).toBe(sharedReactRouterDom);

    render(
      <MemoryRouter initialEntries={['/source']} future={routerFuture}>
        <TrackingV2BUIProvider navigationCalls={navigationCalls}>
          <Routes>
            <Route
              path="source"
              element={<IsolatedProbeAnchor href="/destination" />}
            />
            <Route path="destination" element={<DestinationPage />} />
          </Routes>
          <HistoryBackButton />
        </TrackingV2BUIProvider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Destination' }));
    expect(navigationCalls).toEqual([['/destination', routerOptions]]);
    expect(
      screen.getByRole('heading', { name: 'Destination page' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(
      'PUSH:isolated-react-aria',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(
      screen.getByRole('link', { name: 'Destination' }),
    ).toBeInTheDocument();
  });
});

function HistoryBackButton() {
  const navigate = useNavigate();
  return <button onClick={() => navigate(-1)}>Back</button>;
}

function TrackingV2BUIProvider({
  children,
  navigationCalls,
}: PropsWithChildren<{
  navigationCalls: Array<[string, NavigateOptions | undefined]>;
}>) {
  const hostNavigate = useNavigate();
  const trackedNavigate = useCallback(
    ((to: string, options?: NavigateOptions) => {
      navigationCalls.push([to, options]);
      hostNavigate(to, options);
    }) as ReturnType<typeof useNavigate>,
    [hostNavigate, navigationCalls],
  );
  const routing = useMemo<BUIRoutingIntegration>(
    () => ({
      Link: RouterLink,
      useHref,
      useInRouterContext,
      useLocation,
      useNavigate: () => trackedNavigate,
      useResolvedPath,
      createRouterOptions(_action, options) {
        return { ...options };
      },
    }),
    [trackedNavigate],
  );
  const value = useMemo(
    () => createVersionedValueMap({ 1: {}, 2: { routing } }),
    [routing],
  );

  return <BUIContext.Provider value={value}>{children}</BUIContext.Provider>;
}

function DestinationPage() {
  const location = useLocation();
  const navigationType = useNavigationType();
  return (
    <>
      <h1>Destination page</h1>
      <span role="status">
        {navigationType}:{location.state?.source}
      </span>
    </>
  );
}

function createRouterWrapper({
  entry,
  provider,
}: {
  entry: string;
  provider: 'new' | 'old';
}) {
  return function RouterWrapper({ children }: PropsWithChildren) {
    const content = (
      <Routes>
        <Route path="catalog" element={<Outlet />}>
          <Route path="entity" element={<Outlet />}>
            <Route path="docs/*" element={children} />
          </Route>
        </Route>
      </Routes>
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

function OutsideRouterAnchor({ href }: { href: string }) {
  const routing = useRoutingIntegration({ fallback: true });
  if (!routing.useInRouterContext()) {
    return <a href={href}>Destination</a>;
  }
  throw new Error('Expected to be outside React Router');
}
