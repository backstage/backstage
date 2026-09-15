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
  createEvent,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react';
import {
  createVersionedContext,
  createVersionedValueMap,
  useVersionedContext,
} from '@backstage/version-bridge';
import { Link as ReactAriaLink } from 'react-aria-components';
import { MemoryRouter } from 'react-router-dom';
import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ComponentProps,
  type PropsWithChildren,
} from 'react';
import { useAnalytics } from '../analytics/useAnalytics';
import { fallbackRoutingIntegration } from '../navigation/useRouting';
import { useAnchorNavigation } from '../navigation/useNavigation';
import {
  BUIContext,
  type BUIContextVersions,
  type BUIContextValueV1,
} from './BUIContext';
import { BUIProvider } from './BUIProvider';
import type { BUIRouter } from './BUIRouter';
import { Link } from '../components/Link';
import type { ButtonLink } from '../components/ButtonLink';
import { Tabs, TabList, Tab } from '../components/Tabs';
import { HeaderNav } from '../components/Header/HeaderNav';
// eslint-disable-next-line no-restricted-imports
import { useRouter } from 'react-aria/private/utils/openLink';

type TabComponents = {
  Tabs: typeof Tabs;
  TabList: typeof TabList;
  Tab: typeof Tab;
};

const mockFallbackNavigate = jest.fn();
const BUIContextV1 = createVersionedContext<{ 1: BUIContextValueV1 }>('bui');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockFallbackNavigate,
}));

describe('BUIProvider', () => {
  it('updates links and active items from a hook at the consumer scope without remounting', () => {
    const Scope = createContext({ base: '/root', active: 'overview' });
    const navigate = jest.fn();
    function useHostRouter(): BUIRouter {
      const { base, active } = useContext(Scope);
      return {
        resolveHref: href => '/base' + base + '/' + href,
        navigate: (href, options) => navigate(base + '/' + href, options),
        pathname: '/base' + base + '/' + active,
      };
    }
    function Content({ extra }: { extra: boolean }) {
      const [count, setCount] = useState(0);
      return (
        <>
          <button onClick={() => setCount(count + 1)}>Count {count}</button>
          <Link href="details">Details</Link>
          <Tabs>
            <TabList>
              <Tab id="overview" href="overview">
                Overview
              </Tab>
              <Tab id="activity" href="activity">
                Activity
              </Tab>
            </TabList>
          </Tabs>
          <HeaderNav
            tabs={[
              { id: 'overview', label: 'Header overview', href: 'overview' },
              { id: 'activity', label: 'Header activity', href: 'activity' },
              ...(extra
                ? [{ id: 'extra', label: 'Header extra', href: 'extra' }]
                : []),
            ]}
          />
        </>
      );
    }
    function Host({
      base,
      active,
      extra = false,
    }: {
      base: string;
      active: string;
      extra?: boolean;
    }) {
      return (
        <BUIProvider useRouter={useHostRouter}>
          <Scope.Provider value={{ base, active }}>
            <Content extra={extra} />
          </Scope.Provider>
        </BUIProvider>
      );
    }
    const { rerender } = render(<Host base="/one" active="overview" />);
    const link = screen.getByRole('link', { name: 'Details' });
    expect(link).toHaveAttribute('href', '/base/one/details');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(
      screen.getByRole('link', { name: 'Header overview' }),
    ).toHaveAttribute('aria-current', 'page');
    fireEvent.click(link);
    expect(navigate).toHaveBeenLastCalledWith('/one/details', undefined);
    fireEvent.click(screen.getByRole('button', { name: 'Count 0' }));

    rerender(<Host base="/two" active="activity" extra />);
    expect(screen.getByRole('button', { name: 'Count 1' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Details' })).toBe(link);
    expect(link).toHaveAttribute('href', '/base/two/details');
    fireEvent.click(link);
    expect(navigate).toHaveBeenCalledTimes(2);
    expect(navigate).toHaveBeenLastCalledWith('/two/details', undefined);
    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
    expect(
      screen.getByRole('link', { name: 'Header activity' }),
    ).toHaveAttribute('aria-current', 'page');
    expect(
      screen.getByRole('link', { name: 'Header overview' }),
    ).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: 'Header extra' })).toHaveAttribute(
      'href',
      '/base/two/extra',
    );
  });

  it('retains the host router through nested providers', () => {
    const navigate = jest.fn();
    render(
      <BUIProvider
        useRouter={() =>
          createRouter({ navigate, resolveHref: href => `/base${href}` })
        }
      >
        <BUIProvider>
          <Link href="/catalog">Catalog</Link>
        </BUIProvider>
      </BUIProvider>,
    );

    const link = screen.getByRole('link', { name: 'Catalog' });
    expect(link).toHaveAttribute('href', '/base/catalog');
    fireEvent.click(link);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate.mock.calls[0][0]).toBe('/catalog');
  });

  it.each(['shared', 'isolated'] as const)(
    'shares its host with independently loaded BUI components and %s React Aria',
    ariaCopy => {
      const sharedReact = jest.requireActual('react');
      const sharedReactDom = jest.requireActual('react-dom');
      const sharedReactDomClient = jest.requireActual('react-dom/client');
      const sharedReactAria = jest.requireActual('react-aria');
      const sharedReactAriaComponents = jest.requireActual(
        'react-aria-components',
      );
      let IsolatedLink!: typeof Link;
      let IsolatedButtonLink!: typeof ButtonLink;
      let IsolatedTabs!: TabComponents;
      let isolatedReactAria: unknown;

      jest.isolateModules(() => {
        jest.doMock('react', () => sharedReact);
        jest.doMock('react-dom', () => sharedReactDom);
        jest.doMock('react-dom/client', () => sharedReactDomClient);
        if (ariaCopy === 'shared') {
          jest.doMock('react-aria', () => sharedReactAria);
          jest.doMock('react-aria-components', () => sharedReactAriaComponents);
        }
        isolatedReactAria =
          ariaCopy === 'shared'
            ? jest.requireMock('react-aria')
            : jest.requireActual('react-aria');
        ({ Link: IsolatedLink } = jest.requireActual('../components/Link'));
        ({ ButtonLink: IsolatedButtonLink } = jest.requireActual(
          '../components/ButtonLink',
        ));
        IsolatedTabs = jest.requireActual('../components/Tabs');
      });
      jest.dontMock('react');
      jest.dontMock('react-dom');
      jest.dontMock('react-dom/client');
      jest.dontMock('react-aria');
      jest.dontMock('react-aria-components');

      expect(IsolatedLink).not.toBe(Link);
      if (ariaCopy === 'isolated') {
        expect(isolatedReactAria).not.toBe(sharedReactAria);
      }
      const { Tabs, TabList, Tab } = IsolatedTabs;
      const navigate = jest.fn();
      const captureEvent = jest.fn();
      const router = createRouter({
        navigate,
        resolveHref: href =>
          href.startsWith('/') ? `/base${href}` : `/base/catalog/${href}`,
        pathname: '/base/catalog/overview',
      });
      render(
        <BUIProvider
          useRouter={() => router}
          useAnalytics={() => ({ captureEvent })}
        >
          <IsolatedLink
            href="details"
            routerOptions={{
              replace: true,
              state: { from: 'catalog' },
              flushSync: true,
              preventScrollReset: true,
            }}
          >
            Details
          </IsolatedLink>
          <IsolatedLink href="export" download="catalog.json">
            Download
          </IsolatedLink>
          <IsolatedLink href="overview" target="documentation">
            Documentation
          </IsolatedLink>
          <IsolatedButtonLink href="create">Create</IsolatedButtonLink>
          <Tabs>
            <TabList>
              <Tab id="overview" href="overview">
                Overview
              </Tab>
              <Tab id="activity" href="activity">
                Activity
              </Tab>
            </TabList>
          </Tabs>
        </BUIProvider>,
      );

      const details = screen.getByRole('link', { name: 'Details' });
      expect(details).toHaveAttribute('href', '/base/catalog/details');
      fireEvent.click(details, { ctrlKey: true });
      for (const [name, href] of [
        ['Download', '/base/catalog/export'],
        ['Documentation', '/base/catalog/overview'],
      ]) {
        const link = screen.getByRole('link', { name });
        expect(link).toHaveAttribute('href', href);
        const click = createEvent.click(link);
        fireEvent(link, click);
        expect(click.defaultPrevented).toBe(false);
      }
      expect(navigate).not.toHaveBeenCalled();

      fireEvent.click(details);
      expect(navigate).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenLastCalledWith('details', { replace: true });
      expect(captureEvent).toHaveBeenCalledWith('click', 'Details', {
        attributes: { to: 'details' },
      });

      const create = screen.getByRole('link', { name: 'Create' });
      expect(create).toHaveAttribute('href', '/base/catalog/create');
      fireEvent.click(create);
      expect(navigate).toHaveBeenCalledTimes(2);
      expect(navigate.mock.calls[1][0]).toBe('create');

      expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      const activity = screen.getByRole('tab', { name: 'Activity' });
      expect(activity).toHaveAttribute('href', '/base/catalog/activity');
      fireEvent.click(activity);
      expect(navigate).toHaveBeenCalledTimes(3);
      expect(navigate.mock.calls[2][0]).toBe('activity');
    },
  );

  it('uses the host router for anchors without a shared React Aria provider', () => {
    const navigate = jest.fn();
    const router = createRouter({
      navigate,
      resolveHref: href => `/base${href}`,
    });
    function HostLink() {
      const navigation = useAnchorNavigation({
        href: '/destination',
        routerOptions: { replace: true, flushSync: true },
      });
      if (navigation.type !== 'router') {
        throw new Error('Expected host router navigation');
      }
      return (
        <navigation.Link to={navigation.to} {...navigation.routerLinkOptions}>
          Host destination
        </navigation.Link>
      );
    }

    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <BUIProvider useRouter={() => router}>
          <HostLink />
        </BUIProvider>
      </MemoryRouter>,
    );
    const link = screen.getByRole('link', { name: 'Host destination' });
    expect(link).toHaveAttribute('href', '/base/destination');
    fireEvent.click(link, { ctrlKey: true });
    expect(navigate).not.toHaveBeenCalled();
    fireEvent.click(link);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith('/destination', { replace: true });
    expect(mockFallbackNavigate).not.toHaveBeenCalled();
  });

  beforeEach(() => {
    mockFallbackNavigate.mockReset();
  });

  it('provides stable, self-contained context versions', () => {
    const captureEvent = jest.fn();
    const useProvidedAnalytics = () => ({ captureEvent });
    const wrapper = ({ children }: PropsWithChildren) => (
      <BUIProvider useAnalytics={useProvidedAnalytics}>{children}</BUIProvider>
    );
    const { result, rerender } = renderHook(
      () => ({
        context: useVersionedContext<BUIContextVersions>('bui'),
        analytics: useAnalytics(),
      }),
      { wrapper },
    );

    const firstRouting = result.current.context?.atVersion(2)?.routing;
    const firstCreateRouterOptions = firstRouting?.createRouterOptions;

    expect(result.current.context?.atVersion(1)).toEqual({
      useAnalytics: useProvidedAnalytics,
    });
    expect(result.current.context?.atVersion(2)).toEqual({
      useAnalytics: useProvidedAnalytics,
      routing: firstRouting,
    });
    result.current.analytics.captureEvent('click', 'Destination');
    expect(captureEvent).toHaveBeenCalledWith('click', 'Destination');

    const routerOptions = firstRouting?.createRouterOptions(jest.fn(), {
      replace: true,
    });
    const anotherRouterOptions = firstRouting?.createRouterOptions(jest.fn(), {
      replace: true,
    });

    expect(Object.keys(routerOptions ?? {})).toEqual(['replace']);
    expect(routerOptions).toEqual({ replace: true });
    expect(anotherRouterOptions).not.toBe(routerOptions);

    rerender();

    expect(result.current.context?.atVersion(2)?.routing).toBe(firstRouting);
    expect(
      result.current.context?.atVersion(2)?.routing.createRouterOptions,
    ).toBe(firstCreateRouterOptions);
  });

  it('prefers V2 analytics when both context versions are available', () => {
    const captureV1Event = jest.fn();
    const captureV2Event = jest.fn();
    const value = createVersionedValueMap({
      1: { useAnalytics: () => ({ captureEvent: captureV1Event }) },
      2: {
        useAnalytics: () => ({ captureEvent: captureV2Event }),
        routing: fallbackRoutingIntegration,
      },
    });
    const wrapper = ({ children }: PropsWithChildren) => (
      <BUIContext.Provider value={value}>{children}</BUIContext.Provider>
    );
    const { result } = renderHook(() => useAnalytics(), { wrapper });

    result.current.captureEvent('click', 'Destination');

    expect(captureV2Event).toHaveBeenCalledWith('click', 'Destination');
    expect(captureV1Event).not.toHaveBeenCalled();
  });

  it('accepts analytics from a V1-only provider', () => {
    const captureV1Event = jest.fn();
    const value = createVersionedValueMap({
      1: { useAnalytics: () => ({ captureEvent: captureV1Event }) },
    });
    const wrapper = ({ children }: PropsWithChildren) => (
      <BUIContextV1.Provider value={value}>{children}</BUIContextV1.Provider>
    );
    const { result } = renderHook(() => useAnalytics(), { wrapper });

    result.current.captureEvent('click', 'Legacy destination');
    expect(captureV1Event).toHaveBeenCalledWith('click', 'Legacy destination');
  });

  it('delegates React Aria navigation created by the component', () => {
    const componentNavigate = jest.fn();

    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <BUIProvider>
          <DelegatedLink onNavigate={componentNavigate} />
        </BUIProvider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Destination' }));

    expect(componentNavigate).toHaveBeenCalledTimes(1);
    expect(mockFallbackNavigate).not.toHaveBeenCalled();
  });

  it('uses fallback navigation for unrecognized React Aria router options', () => {
    const linkProps: ComponentProps<typeof ReactAriaLink> = {
      href: '/destination',
      routerOptions: { replace: true },
    };

    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <BUIProvider>
          <ReactAriaLink {...linkProps}>Destination</ReactAriaLink>
        </BUIProvider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Destination' }));

    expect(mockFallbackNavigate).toHaveBeenCalledWith('/destination', {
      replace: true,
    });
  });
});

function DelegatedLink(props: { onNavigate: () => void }) {
  const routing =
    useVersionedContext<BUIContextVersions>('bui')?.atVersion(2)?.routing;
  const routerOptions = useMemo(() => {
    if (!routing) {
      throw new Error('Expected BUI routing integration');
    }
    return routing.createRouterOptions(props.onNavigate, { replace: true });
  }, [props.onNavigate, routing]);

  return (
    <ReactAriaLink href="/destination" routerOptions={routerOptions}>
      Destination
    </ReactAriaLink>
  );
}

function createRouter(overrides: Partial<BUIRouter> = {}): BUIRouter {
  return {
    navigate: jest.fn(),
    resolveHref: href => href,
    pathname: '/',
    ...overrides,
  };
}

describe('BUIProvider', () => {
  it('routes descendant link clicks through a provided navigate function instead of react-router', () => {
    const navigate = jest.fn();

    render(
      <BUIProvider useRouter={() => createRouter({ navigate })}>
        <Link
          href="/catalog/default/component/widget"
          routerOptions={{ replace: true, state: { from: 'catalog' } }}
        >
          Widget
        </Link>
      </BUIProvider>,
    );

    const link = screen.getByRole('link', { name: 'Widget' });
    // No react-router context is required when `navigate` is provided.
    expect(link).toHaveAttribute('href', '/catalog/default/component/widget');

    fireEvent.click(link);

    expect(navigate).toHaveBeenCalledWith('/catalog/default/component/widget', {
      replace: true,
    });
  });

  it('exposes the host resolver through the react-aria router context', () => {
    const navigate = jest.fn();
    const resolveHref = (href: string) => `/base${href}`;
    let captured: ReturnType<typeof useRouter> | undefined;
    let capturedHref: string | undefined;

    function RouterProbe() {
      captured = useRouter();
      capturedHref = captured.useHref('/widget');
      return null;
    }

    render(
      <BUIProvider useRouter={() => createRouter({ navigate, resolveHref })}>
        <RouterProbe />
      </BUIProvider>,
    );

    expect(captured?.isNative).toBe(false);
    expect(capturedHref).toBe('/base/widget');
  });

  it('adapts ambient react-router navigation when router is not provided', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <BUIProvider>
          <Link href="/catalog">Catalog</Link>
        </BUIProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Catalog' })).toHaveAttribute(
      'href',
      '/catalog',
    );
  });

  it('renders without any routing authority', () => {
    render(
      <BUIProvider>
        <Link href="/catalog">Catalog</Link>
      </BUIProvider>,
    );

    expect(screen.getByRole('link', { name: 'Catalog' })).toHaveAttribute(
      'href',
      '/catalog',
    );
  });

  it.each([
    ['a new browsing context', { target: '_blank' }],
    ['a named browsing context', { target: 'documentation' }],
    ['a download', { download: 'catalog.json' }],
  ])('leaves %s to the browser', (_description, linkProps) => {
    const navigate = jest.fn();

    render(
      <BUIProvider useRouter={() => createRouter({ navigate })}>
        <Link href="/catalog" {...linkProps}>
          Catalog
        </Link>
      </BUIProvider>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Catalog' }));

    expect(navigate).not.toHaveBeenCalled();
  });
});
